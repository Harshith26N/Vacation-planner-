# backend/database.py

import sqlite3
import click
from flask import current_app, g

DATABASE = 'database.db'

def get_db():
    """Connects to the specified database."""
    if 'db' not in g:
        g.db = sqlite3.connect(
            DATABASE,
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row # This makes rows behave like dictionaries

    return g.db

def close_db(e=None):
    """Closes the database connection."""
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db():
    """Initializes the database from schema.sql."""
    db = get_db()
    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))
    db.commit() # Commit changes to make them permanent

@click.command('init-db')
def init_db_command():
    """Clear existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')

def init_app(app):
    """Registers database functions with the Flask app."""
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)