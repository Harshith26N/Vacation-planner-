// frontend/src/pages/BudgetTrackerPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Assuming AuthContext provides user ID
import jsPDF from 'jspdf'; // Import jsPDF for PDF generation

const BudgetTrackerPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // Get current user from AuthContext

    // State for budget and expenses
    const [overallBudget, setOverallBudget] = useState('');
    const [categoryBudgets, setCategoryBudgets] = useState({
        Food: '', Transport: '', Accommodation: '', Activities: '', Shopping: '', Other: ''
    });
    const [expenseDescription, setExpenseDescription] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseCategory, setExpenseCategory] = useState('Food');
    const [expenses, setExpenses] = useState([]); // Stores all expenses (actual + planned)
    const [isPlannedExpense, setIsPlannedExpense] = useState(false); // To distinguish planned vs actual
    const [currency, setCurrency] = useState('INR'); // Default currency set to INR

    // For custom alerts/confirmations
    const [infoMessage, setInfoMessage] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [confirmAction, setConfirmAction] = useState(null);

    // Define expense categories
    const expenseCategories = ['Food', 'Transport', 'Accommodation', 'Activities', 'Shopping', 'Other'];

    // Unique keys for localStorage based on user ID
    const userId = user ? user.id : 'guest';
    const localStorageKeyBudget = `budget_tracker_${userId}_overall`;
    const localStorageKeyCategoryBudgets = `budget_tracker_${userId}_category_budgets`;
    const localStorageKeyExpenses = `budget_tracker_${userId}_expenses`;
    const localStorageKeyCurrency = `budget_tracker_${userId}_currency`;

    // Load budget and expenses from localStorage on component mount
    useEffect(() => {
        const savedBudget = localStorage.getItem(localStorageKeyBudget);
        const savedCategoryBudgets = localStorage.getItem(localStorageKeyCategoryBudgets);
        const savedExpenses = localStorage.getItem(localStorageKeyExpenses);
        const savedCurrency = localStorage.getItem(localStorageKeyCurrency);

        if (savedBudget) {
            setOverallBudget(savedBudget);
        }
        if (savedCategoryBudgets) {
            try {
                setCategoryBudgets(JSON.parse(savedCategoryBudgets));
            } catch (e) {
                console.error("Failed to parse saved category budgets from localStorage", e);
                setCategoryBudgets({ Food: '', Transport: '', 'Accommodation': '', Activities: '', Shopping: '', Other: '' });
            }
        }
        if (savedExpenses) {
            try {
                setExpenses(JSON.parse(savedExpenses));
            } catch (e) {
                console.error("Failed to parse saved expenses from localStorage", e);
                setExpenses([]); // Reset if corrupted
            }
        }
        if (savedCurrency) {
            setCurrency(savedCurrency);
        }
    }, [userId, localStorageKeyBudget, localStorageKeyCategoryBudgets, localStorageKeyExpenses, localStorageKeyCurrency]);

    // Helper to format currency display
    const formatCurrency = (amount) => {
        const value = parseFloat(amount);
        if (isNaN(value)) return `${currency}0.00`;
        return `${currency}${value.toFixed(2)}`;
    };

    // Calculate totals
    const actualExpenses = useMemo(() => expenses.filter(exp => !exp.isPlanned), [expenses]);
    const plannedExpenses = useMemo(() => expenses.filter(exp => exp.isPlanned), [expenses]);

    const totalActualSpent = useMemo(() => actualExpenses.reduce((sum, exp) => sum + exp.amount, 0), [actualExpenses]);
    const totalPlannedSpending = useMemo(() => plannedExpenses.reduce((sum, exp) => sum + exp.amount, 0), [plannedExpenses]);
    const totalProjectedSpending = totalActualSpent + totalPlannedSpending;

    // Calculate total allocated to categories
    const totalAllocatedCategoryBudget = useMemo(() => {
        return Object.values(categoryBudgets).reduce((sum, val) => sum + parseFloat(val || 0), 0);
    }, [categoryBudgets]);

    // Calculate overall remaining budget considering actual spent
    const calculateRemainingOverallBudget = useMemo(() => {
        const parsedOverallBudget = parseFloat(overallBudget || 0);
        return parsedOverallBudget - totalActualSpent;
    }, [overallBudget, totalActualSpent]);

    // Calculate unallocated portion of the overall budget
    const calculateUnallocatedOverallBudget = useMemo(() => {
        const parsedOverallBudget = parseFloat(overallBudget || 0);
        return parsedOverallBudget - totalAllocatedCategoryBudget;
    }, [overallBudget, totalAllocatedCategoryBudget]);


    // Calculate remaining for category considering allocated budget and actual spent
    const calculateRemainingCategoryBudget = (category) => {
        const allocated = parseFloat(categoryBudgets[category] || 0);
        const spent = getCategoryActualSpent(category);
        return allocated - spent;
    };

    // Helper to get actual spent for a category
    const getCategoryActualSpent = (category) =>
        actualExpenses.filter(exp => exp.category === category).reduce((sum, exp) => sum + exp.amount, 0);

    // Helper to get planned spending for a category
    const getCategoryPlannedSpending = (category) =>
        plannedExpenses.filter(exp => exp.category === category).reduce((sum, exp) => sum + exp.amount, 0);

    // --- Handlers for budget and expenses ---
    const handleSetOverallBudget = () => {
        const budgetValue = parseFloat(overallBudget);
        const MIN_OVERALL_BUDGET = 1000; // Realistic minimum
        const MAX_OVERALL_BUDGET = 1000000; // Realistic maximum

        if (isNaN(budgetValue) || budgetValue < MIN_OVERALL_BUDGET || budgetValue > MAX_OVERALL_BUDGET) {
            setInfoMessage(`Please enter a valid overall budget amount between ${formatCurrency(MIN_OVERALL_BUDGET)} and ${formatCurrency(MAX_OVERALL_BUDGET)}.`);
            return;
        }

        setOverallBudget(budgetValue.toFixed(2));
        localStorage.setItem(localStorageKeyBudget, budgetValue.toFixed(2));
        setInfoMessage(`Overall budget set to ${formatCurrency(budgetValue.toFixed(2))}`);
    };

    const handleSetCategoryBudget = (category) => {
        const value = categoryBudgets[category]; // Get the current value from state
        const budgetValue = parseFloat(value);
        if (isNaN(budgetValue) || budgetValue < 0) {
            setInfoMessage(`Please enter a valid non-negative budget amount for ${category}.`);
            return;
        }

        const parsedOverallBudget = parseFloat(overallBudget || 0);
        // Calculate current total allocated across all categories *excluding* the one being changed
        const currentTotalAllocatedExcludingThisCategory = Object.entries(categoryBudgets).reduce((sum, [cat, val]) => {
            return sum + (cat === category ? 0 : parseFloat(val || 0));
        }, 0);

        const newTotalAllocatedIncludingThisCategory = currentTotalAllocatedExcludingThisCategory + budgetValue;

        if (parsedOverallBudget > 0 && newTotalAllocatedIncludingThisCategory > parsedOverallBudget) {
            setInfoMessage(`Cannot set ${category} budget to ${formatCurrency(budgetValue.toFixed(2))}. This would exceed your overall budget of ${formatCurrency(parsedOverallBudget.toFixed(2))}. Current total allocated: ${formatCurrency(currentTotalAllocatedExcludingThisCategory)}`);
            return;
        }

        const updatedCategoryBudgets = { ...categoryBudgets, [category]: value };
        setCategoryBudgets(updatedCategoryBudgets);
        localStorage.setItem(localStorageKeyCategoryBudgets, JSON.stringify(updatedCategoryBudgets));
        setInfoMessage(`${category} budget set to ${formatCurrency(budgetValue.toFixed(2))}. Unallocated overall budget: ${formatCurrency(parsedOverallBudget - newTotalAllocatedIncludingThisCategory)}`);
    };

    const handleAddExpense = () => {
        const amount = parseFloat(expenseAmount);
        if (expenseDescription.trim() && !isNaN(amount) && amount > 0) {
            const parsedOverallBudget = parseFloat(overallBudget || 0);

            // Check overall budget constraint for actual expenses
            if (!isPlannedExpense && parsedOverallBudget > 0 && (totalActualSpent + amount) > parsedOverallBudget) {
                setInfoMessage(`Cannot add this expense. Adding ${formatCurrency(amount.toFixed(2))} would exceed your overall budget of ${formatCurrency(parsedOverallBudget.toFixed(2))}. Remaining: ${formatCurrency(calculateRemainingOverallBudget.toFixed(2))}`);
                return;
            }

            // Check category budget constraint for actual expenses
            const allocatedCategoryBudget = parseFloat(categoryBudgets[expenseCategory] || 0);
            const currentCategorySpent = getCategoryActualSpent(expenseCategory);
            if (!isPlannedExpense && allocatedCategoryBudget > 0 && (currentCategorySpent + amount) > allocatedCategoryBudget) {
                setInfoMessage(`Cannot add this expense. Adding ${formatCurrency(amount.toFixed(2))} would exceed your allocated budget for ${expenseCategory} (${formatCurrency(allocatedCategoryBudget.toFixed(2))}). Remaining for ${expenseCategory}: ${formatCurrency(calculateRemainingCategoryBudget(expenseCategory).toFixed(2))}`);
                return;
            }

            const newExpense = {
                id: Date.now(), // Unique ID
                description: expenseDescription.trim(),
                amount: amount,
                category: expenseCategory,
                date: new Date().toLocaleDateString(),
                isPlanned: isPlannedExpense,
            };
            const updatedExpenses = [...expenses, newExpense];
            setExpenses(updatedExpenses);
            localStorage.setItem(localStorageKeyExpenses, JSON.stringify(updatedExpenses));
            setExpenseDescription('');
            setExpenseAmount('');
            setIsPlannedExpense(false); // Reset checkbox
            setInfoMessage(`Expense added: ${newExpense.description} for ${formatCurrency(newExpense.amount.toFixed(2))}.`);
        } else {
            setInfoMessage('Please enter a valid description and a positive amount for the expense.');
        }
    };

    const handleDeleteExpense = (id) => {
        const updatedExpenses = expenses.filter(exp => exp.id !== id);
        setExpenses(updatedExpenses);
        localStorage.setItem(localStorageKeyExpenses, JSON.stringify(updatedExpenses));
        setInfoMessage('Expense deleted successfully.');
    };

    const handleClearAllData = () => {
        setConfirmMessage('Are you sure you want to clear all budget and expense data? This cannot be undone.');
        setConfirmAction(() => () => {
            localStorage.removeItem(localStorageKeyBudget);
            localStorage.removeItem(localStorageKeyCategoryBudgets);
            localStorage.removeItem(localStorageKeyExpenses);
            localStorage.removeItem(localStorageKeyCurrency);
            setOverallBudget('');
            setCategoryBudgets({ Food: '', Transport: '', Accommodation: '', Activities: '', Shopping: '', Other: '' });
            setExpenses([]);
            setCurrency('INR'); // Reset to default INR
            setInfoMessage('All budget and expense data cleared.');
            setShowConfirmModal(false);
        });
        setShowConfirmModal(true);
    };

    const handleConfirm = () => {
        if (confirmAction) {
            confirmAction();
        }
    };

    const handleCancelConfirm = () => {
        setShowConfirmModal(false);
        setConfirmAction(null);
        setConfirmMessage('');
    };

    const handleCurrencyChange = (e) => {
        const newCurrency = e.target.value;
        setCurrency(newCurrency);
        localStorage.setItem(localStorageKeyCurrency, newCurrency);
    };

    // Determine if adding an expense is allowed based on overall budget
    const isOverallBudgetSet = parseFloat(overallBudget || 0) > 0;
    const canAddActualExpense = isOverallBudgetSet && calculateRemainingOverallBudget > 0;
    const canAddPlannedExpense = isOverallBudgetSet; // You can always plan, but it will show in projected totals

    // --- PDF Generation ---
    const handlePrintPdf = () => {
        const doc = new jsPDF();
        let yPos = 20;

        doc.setFontSize(22);
        doc.text("Budget Tracker Summary", 105, yPos, { align: "center" });
        yPos += 15;

        doc.setFontSize(14);
        doc.text("Overall Budget Overview", 15, yPos);
        yPos += 8;
        doc.setFontSize(12);
        doc.text(`Total Overall Budget: ${formatCurrency(overallBudget || 0)}`, 20, yPos);
        yPos += 7;
        doc.text(`Total Allocated to Categories: ${formatCurrency(totalAllocatedCategoryBudget)}`, 20, yPos);
        yPos += 7;
        doc.text(`Unallocated Overall Budget: ${formatCurrency(calculateUnallocatedOverallBudget)}`, 20, yPos);
        yPos += 7;
        doc.text(`Total Actual Spent: ${formatCurrency(totalActualSpent)}`, 20, yPos);
        yPos += 7;
        doc.text(`Total Planned Spending: ${formatCurrency(totalPlannedSpending)}`, 20, yPos);
        yPos += 7;
        doc.text(`Projected Total Spending: ${formatCurrency(totalProjectedSpending)}`, 20, yPos);
        yPos += 7;
        doc.text(`Remaining Overall Budget (after actual spent): ${formatCurrency(calculateRemainingOverallBudget)}`, 20, yPos);
        yPos += 15;

        doc.setFontSize(14);
        doc.text("Category Budgets", 15, yPos);
        yPos += 8;
        expenseCategories.forEach(category => {
            const allocated = parseFloat(categoryBudgets[category] || 0);
            const spent = getCategoryActualSpent(category);
            const planned = getCategoryPlannedSpending(category);
            const remaining = allocated - spent;
            doc.setFontSize(12);
            doc.text(`${category}: Allocated ${formatCurrency(allocated)} | Spent ${formatCurrency(spent)} | Planned ${formatCurrency(planned)} | Remaining ${formatCurrency(remaining)}`, 20, yPos);
            yPos += 7;
        });
        yPos += 15;

        doc.setFontSize(14);
        doc.text("All Expenses (Actual & Planned)", 15, yPos);
        yPos += 8;
        if (expenses.length > 0) {
            expenses.forEach(exp => {
                const type = exp.isPlanned ? 'Planned' : 'Actual';
                doc.setFontSize(10);
                doc.text(`- ${exp.description} (${exp.category}) - ${formatCurrency(exp.amount)} (${type}) on ${exp.date}`, 20, yPos);
                yPos += 6;
                if (yPos > 280) { // Check for page overflow
                    doc.addPage();
                    yPos = 20;
                }
            });
        } else {
            doc.setFontSize(12);
            doc.text("No expenses recorded yet.", 20, yPos);
        }

        doc.save('BudgetTrackerSummary.pdf');
        setInfoMessage('Budget summary exported to PDF.');
    };


    // Styles
    const styles = {
        container: {
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            backgroundColor: '#f5f7fa',
            padding: '40px 20px',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        card: {
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 15px 50px rgba(0,0,0,0.1)',
            padding: '40px 60px',
            width: '100%',
            maxWidth: '900px',
            boxSizing: 'border-box',
            animation: 'fadeIn 0.8s ease-out',
            position: 'relative',
        },
        backButton: {
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1em',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease, transform 0.2s ease',
            marginBottom: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        },
        title: {
            textAlign: 'center',
            color: '#2c3e50',
            fontSize: '3em',
            marginBottom: '30px',
            fontWeight: '700',
            textShadow: '1px 1px 5px rgba(0,0,0,0.08)',
        },
        sectionTitle: {
            color: '#34495e',
            fontSize: '2em',
            marginBottom: '20px',
            fontWeight: '600',
            borderLeft: '5px solid #3498db',
            paddingLeft: '15px',
            marginTop: '40px',
        },
        subSectionTitle: {
            color: '#34495e',
            fontSize: '1.4em',
            marginBottom: '15px',
            fontWeight: '500',
            marginTop: '25px',
        },
        inputGroup: {
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
            flexWrap: 'wrap',
            alignItems: 'center',
        },
        inputField: {
            flex: '1 1 180px',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1em',
        },
        button: {
            padding: '12px 25px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1em',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
        },
        disabledButton: {
            backgroundColor: '#cccccc',
            cursor: 'not-allowed',
        },
        summaryBox: {
            backgroundColor: '#e9f7ef',
            border: '1px solid #d4edda',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        },
        summaryText: {
            margin: '8px 0',
            fontSize: '1.2em',
            color: '#333',
            fontWeight: '500',
        },
        amountDisplay: {
            fontWeight: '700',
        },
        progressBar: {
            width: '100%',
            height: '12px',
            borderRadius: '6px',
            border: 'none',
            marginTop: '15px',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none',
        },
        expenseList: {
            listStyle: 'none',
            padding: '0',
            margin: '0',
        },
        expenseItem: {
            backgroundColor: '#f0f4f7',
            padding: '12px 18px',
            marginBottom: '10px',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        },
        expenseDetails: {
            fontSize: '1em',
            color: '#444',
            flexGrow: 1,
        },
        deleteButton: {
            background: 'none',
            border: 'none',
            color: '#dc3545',
            fontSize: '1.3em',
            cursor: 'pointer',
            padding: '5px',
            borderRadius: '50%',
            transition: 'background-color 0.2s ease, color 0.2s ease',
            marginLeft: '10px',
        },
        'deleteButton:hover': {
            backgroundColor: '#dc3545',
            color: 'white',
        },
        currencySelect: {
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1em',
            backgroundColor: 'white',
            marginBottom: '20px',
        },
        clearDataButton: {
            padding: '10px 20px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.9em',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            marginTop: '30px',
        },
        categoryBudgetGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px',
            marginBottom: '20px',
        },
        categoryBudgetCard: {
            backgroundColor: '#f9f9f9',
            padding: '15px',
            borderRadius: '10px',
            border: '1px solid #e0e6ed',
            boxShadow: '0 1px 5px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
        },
        categoryBudgetInput: {
            width: '100%',
            padding: '8px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '0.9em',
            marginTop: '5px',
        },
        expenseTypeCheckbox: {
            marginLeft: '10px',
            transform: 'scale(1.1)',
            cursor: 'pointer',
        },
        // Progress bar specific styles
        '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(20px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
        },
        progressBarStyle: `
            progress::-webkit-progress-bar { background-color: #ecf0f1; border-radius: 5px; }
            progress::-webkit-progress-value { background-color: #2ecc71; border-radius: 5px; transition: width 0.5s ease-in-out; }
            progress[value^="0."]::-webkit-progress-value,
            progress[value^="0.9"]::-webkit-progress-value { background-color: #e67e22; } /* Orange for warning */
            progress[value^="1."]::-webkit-progress-value { background-color: #e74c3c; } /* Red for over budget */
        `,
        alertMessage: {
            backgroundColor: '#ffe0b2', // Light orange
            color: '#e65100', // Dark orange text
            padding: '10px 15px',
            borderRadius: '8px',
            marginBottom: '15px',
            fontSize: '0.9em',
            fontWeight: 'bold',
            border: '1px solid #ffcc80',
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        },
        modalContent: {
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            textAlign: 'center',
            maxWidth: '400px',
            width: '90%',
        },
        modalButton: {
            padding: '10px 20px',
            margin: '0 10px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1em',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease',
        },
        modalConfirmButton: {
            backgroundColor: '#dc3545',
            color: 'white',
        },
        modalCancelButton: {
            backgroundColor: '#6c757d',
            color: 'white',
        }
    };

    return (
        <div style={styles.container}>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                ${styles.progressBarStyle}
            `}</style>
            <div style={styles.card}>
                <button onClick={() => navigate(-1)} style={styles.backButton}>&larr; Back to Dashboard</button>
                <h1 style={styles.title}>Your Personal Budget Tracker</h1>

                {infoMessage && (
                    <p style={styles.alertMessage}>{infoMessage}</p>
                )}

                <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                    <select value={currency} onChange={handleCurrencyChange} style={styles.currencySelect}>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                        <option value="INR">INR (₹)</option>
                        {/* Add more currencies as needed */}
                    </select>
                </div>

                <section>
                    <h2 style={styles.sectionTitle}>Overall Budget</h2>
                    <div style={styles.inputGroup}>
                        <input
                            type="number"
                            placeholder={`Set your overall trip budget (${currency})`}
                            value={overallBudget}
                            onChange={(e) => setOverallBudget(e.target.value)}
                            style={styles.inputField}
                            min="1000" // Set minimum value to 1000
                            max="1000000" // Set maximum value to 1,000,000
                        />
                        <button onClick={handleSetOverallBudget} style={styles.button}>Set Overall Budget</button>
                    </div>

                    {isOverallBudgetSet && (
                        <div style={styles.summaryBox}>
                            <p style={styles.summaryText}>Total Overall Budget: <span style={{ ...styles.amountDisplay, color: '#28a745' }}>{formatCurrency(overallBudget)}</span></p>
                            <p style={styles.summaryText}>Total Allocated to Categories: <span style={{ ...styles.amountDisplay, color: '#3498db' }}>{formatCurrency(totalAllocatedCategoryBudget)}</span></p>
                            <p style={{ ...styles.summaryText, color: calculateUnallocatedOverallBudget < 0 ? '#e74c3c' : '#2ecc71' }}>
                                Unallocated Overall Budget: <span style={styles.amountDisplay}>{formatCurrency(calculateUnallocatedOverallBudget)}</span>
                            </p>
                            <p style={styles.summaryText}>Total Actual Spent: <span style={{ ...styles.amountDisplay, color: '#dc3545' }}>{formatCurrency(totalActualSpent)}</span></p>
                            <p style={styles.summaryText}>Total Planned Spending: <span style={{ ...styles.amountDisplay, color: '#e67e22' }}>{formatCurrency(totalPlannedSpending)}</span></p>
                            <p style={styles.summaryText}>Projected Total Spending: <span style={{ ...styles.amountDisplay, color: '#3498db' }}>{formatCurrency(totalProjectedSpending)}</span></p>

                            <p style={{ ...styles.summaryText, color: calculateRemainingOverallBudget < 0 ? '#e74c3c' : '#2ecc71' }}>
                                Remaining Overall Budget (after actual spent): <span style={styles.amountDisplay}>{formatCurrency(calculateRemainingOverallBudget)}</span>
                            </p>
                            <progress
                                value={totalActualSpent}
                                max={overallBudget}
                                style={styles.progressBar}
                            ></progress>
                            {calculateRemainingOverallBudget < 0 && (
                                <p style={{ color: '#e74c3c', fontSize: '0.9em', marginTop: '10px' }}>You are over your overall budget! Consider adjusting your spending or budget.</p>
                            )}
                        </div>
                    )}
                </section>

                <section>
                    <h2 style={styles.sectionTitle}>Category Budgets</h2>
                    {!isOverallBudgetSet && (
                        <p style={styles.alertMessage}>Please set your **Overall Budget** first before allocating to categories.</p>
                    )}
                    <div style={styles.categoryBudgetGrid}>
                        {expenseCategories.map(category => {
                            const allocated = parseFloat(categoryBudgets[category] || 0);
                            const spent = getCategoryActualSpent(category);
                            const planned = getCategoryPlannedSpending(category);
                            const remaining = allocated - spent;
                            const categoryInputDisabled = !isOverallBudgetSet;

                            return (
                                <div key={category} style={styles.categoryBudgetCard}>
                                    <strong>{category} Budget:</strong>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                                        <input
                                            type="number"
                                            placeholder={`Set ${category} budget (${currency})`}
                                            value={categoryBudgets[category]}
                                            onChange={(e) => setCategoryBudgets({ ...categoryBudgets, [category]: e.target.value })}
                                            style={{ ...styles.categoryBudgetInput, flexGrow: 1 }}
                                            min="0"
                                            disabled={categoryInputDisabled}
                                        />
                                        <button
                                            onClick={() => handleSetCategoryBudget(category)}
                                            style={{ ...styles.button, padding: '8px 15px', fontSize: '0.8em', backgroundColor: '#3498db', ...(categoryInputDisabled ? styles.disabledButton : {}) }}
                                            disabled={categoryInputDisabled}
                                        >
                                            Set
                                        </button>
                                    </div>
                                    {!categoryInputDisabled && (
                                        <p style={{ fontSize: '0.9em', margin: '5px 0 0 0', color: '#555' }}>
                                            Allocated: <strong style={{ color: '#28a745' }}>{formatCurrency(allocated)}</strong>
                                            <br />
                                            Spent: <strong style={{ color: '#dc3545' }}>{formatCurrency(spent)}</strong>
                                            <br />
                                            Planned: <strong style={{ color: '#e67e22' }}>{formatCurrency(planned)}</strong>
                                            <br />
                                            Remaining: <strong style={{ color: remaining < 0 ? '#e74c3c' : '#3498db' }}>{formatCurrency(remaining)}</strong>
                                        </p>
                                    )}
                                    {allocated > 0 && (
                                        <progress
                                            value={spent}
                                            max={allocated}
                                            style={{ ...styles.progressBar, height: '8px', marginTop: '8px' }}
                                        ></progress>
                                    )}
                                    {remaining < 0 && allocated > 0 && (
                                        <p style={{ color: '#e74c3c', fontSize: '0.8em', marginTop: '5px' }}>
                                            You are **{formatCurrency(-remaining)}** over your {category} budget!
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section>
                    <h2 style={styles.sectionTitle}>Add New Expense</h2>
                    {!isOverallBudgetSet && (
                        <p style={styles.alertMessage}>Please set your **Overall Budget** before adding expenses.</p>
                    )}
                    {isOverallBudgetSet && calculateRemainingOverallBudget <= 0 && (
                        <p style={styles.alertMessage}>
                            **Warning!** Your overall budget has been fully spent or exceeded. You cannot add new actual expenses.
                            Consider increasing your overall budget or re-evaluating planned expenses.
                        </p>
                    )}
                    <div style={styles.inputGroup}>
                        <input
                            type="text"
                            placeholder="Expense description (e.g., Dinner in Paris)"
                            value={expenseDescription}
                            onChange={(e) => setExpenseDescription(e.target.value)}
                            style={styles.inputField}
                            disabled={!isOverallBudgetSet || (calculateRemainingOverallBudget <= 0 && !isPlannedExpense)}
                        />
                        <input
                            type="number"
                            placeholder={`Amount (${currency})`}
                            value={expenseAmount}
                            onChange={(e) => setExpenseAmount(e.target.value)}
                            style={styles.inputField}
                            min="0"
                            disabled={!isOverallBudgetSet || (calculateRemainingOverallBudget <= 0 && !isPlannedExpense)}
                        />
                        <select
                            value={expenseCategory}
                            onChange={(e) => setExpenseCategory(e.target.value)}
                            style={styles.inputField}
                            disabled={!isOverallBudgetSet || (calculateRemainingOverallBudget <= 0 && !isPlannedExpense)}
                        >
                            {expenseCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <label>
                            <input
                                type="checkbox"
                                checked={isPlannedExpense}
                                onChange={(e) => setIsPlannedExpense(e.target.checked)}
                                style={styles.expenseTypeCheckbox}
                                disabled={!isOverallBudgetSet || (calculateRemainingOverallBudget <= 0 && !isPlannedExpense)}
                            />
                            Planned Expense
                        </label>
                        <button
                            onClick={handleAddExpense}
                            style={{ ...styles.button, backgroundColor: '#007bff', ...(!isOverallBudgetSet || (calculateRemainingOverallBudget <= 0 && !isPlannedExpense) ? styles.disabledButton : {}) }}
                            disabled={!isOverallBudgetSet || (calculateRemainingOverallBudget <= 0 && !isPlannedExpense)}
                        >
                            Add Expense
                        </button>
                    </div>
                </section>

                {expenses.length > 0 && (
                    <section>
                        <h2 style={styles.sectionTitle}>All Expenses</h2>
                        <h3 style={styles.subSectionTitle}>Actual Expenses</h3>
                        <ul style={styles.expenseList}>
                            {actualExpenses.length > 0 ? actualExpenses.map((exp) => (
                                <li key={exp.id} style={styles.expenseItem}>
                                    <span style={styles.expenseDetails}>
                                        <strong>{exp.description}</strong> ({exp.category}) - {formatCurrency(exp.amount)} on {exp.date}
                                    </span>
                                    <button onClick={() => handleDeleteExpense(exp.id)} style={styles.deleteButton}>&times;</button>
                                </li>
                            )) : <p style={{ color: '#777' }}>No actual expenses recorded yet.</p>}
                        </ul>

                        <h3 style={styles.subSectionTitle}>Planned Expenses</h3>
                        <ul style={styles.expenseList}>
                            {plannedExpenses.length > 0 ? plannedExpenses.map((exp) => (
                                <li key={exp.id} style={styles.expenseItem}>
                                    <span style={styles.expenseDetails}>
                                        <strong>{exp.description}</strong> ({exp.category}) - {formatCurrency(exp.amount)} (Planned for {exp.date})
                                    </span>
                                    <button onClick={() => handleDeleteExpense(exp.id)} style={styles.deleteButton}>&times;</button>
                                </li>
                            )) : <p style={{ color: '#777' }}>No planned expenses recorded yet.</p>}
                        </ul>
                    </section>
                )}

                <button
                    onClick={handleClearAllData}
                    style={{ ...styles.clearDataButton, backgroundColor: '#e74c3c' }}
                >
                    Clear All Budget Data
                </button>

                <button
                    onClick={handlePrintPdf}
                    style={{ ...styles.button, backgroundColor: '#6c757d', marginTop: '30px' }}
                >
                    Print Budget Summary to PDF
                </button>
            </div>

            {showConfirmModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <p>{confirmMessage}</p>
                        <button
                            onClick={handleConfirm}
                            style={{ ...styles.modalButton, ...styles.modalConfirmButton }}
                        >
                            Yes, Clear Data
                        </button>
                        <button
                            onClick={handleCancelConfirm}
                            style={{ ...styles.modalButton, ...styles.modalCancelButton }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BudgetTrackerPage;
