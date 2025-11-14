# backend/app.py

from flask import Flask, request, jsonify, g
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import jwt
import datetime
from functools import wraps
from database import get_db, close_db, init_app # Import database functions

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}) # Allow CORS from your React dev server

# Secret key for JWT and session management (CHANGE THIS IN PRODUCTION!)
app.config['SECRET_KEY'] = 'your_super_secret_key_change_this_for_production_use_env_vars'

# Initialize database functions with the app
init_app(app)

# --- JWT Decorator for protected routes ---
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Check for JWT in Authorization header
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1] # Bearer <token>

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            # Decode the token
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            # Fetch user from DB (optional, but good for active sessions)
            db = get_db()
            cursor = db.cursor()
            cursor.execute("SELECT id, username, email FROM users WHERE id = ?", (data['user_id'],))
            current_user = cursor.fetchone()

            if not current_user:
                return jsonify({'message': 'User not found!'}), 401

            g.current_user = current_user # Store current_user in Flask's global context
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(*args, **kwargs)
    return decorated

# --- Routes ---

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'message': 'Missing fields!'}), 400

    # Password constraints (backend validation - should match frontend)
    # At least 8 characters, one uppercase, one lowercase, one number, one special character
    if not (len(password) >= 8 and
            any(char.isupper() for char in password) and
            any(char.islower() for char in password) and
            any(char.isdigit() for char in password) and
            any(char in "!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?`~" for char in password)):
        return jsonify({'message': 'Password does not meet complexity requirements.'}), 400

    db = get_db()
    cursor = db.cursor()

    try:
        # Check if username or email already exists
        cursor.execute("SELECT id FROM users WHERE username = ? OR email = ?", (username, email))
        if cursor.fetchone():
            return jsonify({'message': 'Username or Email already exists!'}), 409

        hashed_password = generate_password_hash(password)
        cursor.execute("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
                       (username, email, hashed_password))
        db.commit()
        return jsonify({'message': 'User registered successfully!'}), 201
    except sqlite3.Error as e:
        db.rollback()
        return jsonify({'message': 'Database error: ' + str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT id, username, email, password_hash FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()

    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({'message': 'Invalid username or password!'}), 401

    # Generate JWT
    token = jwt.encode(
        {'user_id': user['id'], 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)},
        app.config['SECRET_KEY'],
        algorithm="HS256"
    )

    return jsonify({
        'message': 'Login successful!',
        'token': token,
        'user': {'id': user['id'], 'username': user['username'], 'email': user['email']}
    }), 200

@app.route('/api/dashboard', methods=['GET'])
@token_required
def dashboard():
    # g.current_user is available because of @token_required decorator
    return jsonify({
        'message': f'Welcome to your dashboard, {g.current_user["username"]}!',
        'user_info': dict(g.current_user) # Convert Row object to dict for jsonify
    }), 200

@app.route('/api/check-auth', methods=['GET'])
@token_required
def check_auth():
    # If token is valid, this route simply returns success
    return jsonify({'isAuthenticated': True, 'user': dict(g.current_user)}), 200


if __name__ == '__main__':
    # To initialize the database on first run:
    # 1. Run 'flask --app app init-db' in your backend directory
    # 2. Then run 'flask --app app run' or 'python app.py'
    app.run(debug=True, port=5000)