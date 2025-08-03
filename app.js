// Simple Finance Tracker JavaScript

class SimpleFinanceTracker {
    constructor() {
        this.transactions = [
            {
                id: 1,
                date: "2025-01-04",
                amount: 50000,
                category: "Salary",
                type: "credit",
                description: "Monthly salary"
            },
            {
                id: 2,
                date: "2025-01-04",
                amount: 25,
                category: "Chai/Tea & Coffee",
                type: "debit",
                description: "Evening chai"
            },
            {
                id: 3,
                date: "2025-01-04",
                amount: 80,
                category: "Auto/Rickshaw",
                type: "debit",
                description: "Auto to office"
            }
        ];

        this.categories = {
            credit: [
                "Salary",
                "Freelance Work",
                "Gifts/Bonus",
                "Investments",
                "Business Income",
                "Other Income"
            ],
            debit: [
                "Chai/Tea & Coffee",
                "Auto/Rickshaw",
                "Street Food",
                "Metro/Bus Transport",
                "Mobile Recharge",
                "Domestic Help",
                "Groceries/Sabzi",
                "Medical/Hospital",
                "Petrol/Fuel",
                "Electricity Bill",
                "Internet/WiFi",
                "Clothing/Shopping",
                "Entertainment/Movies",
                "Dining Out",
                "EMI/Loans",
                "Other Expense"
            ]
        };

        this.charts = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setCurrentDate();
        this.updateDashboard();
        this.renderTransactions();
        
        // Initialize charts after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.initializeCharts();
        }, 100);
    }

    setupEventListeners() {
        const form = document.getElementById('transactionForm');
        const resetBtn = document.getElementById('resetBtn');

        // Form submission
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Use event delegation for radio buttons to ensure they work
        const radioContainer = document.querySelector('.radio-group');
        if (radioContainer) {
            radioContainer.addEventListener('change', (e) => {
                if (e.target.type === 'radio' && e.target.name === 'transactionType') {
                    this.updateCategoryOptions(e.target.value);
                }
            });
        }

        // Reset button
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetForm());
        }
    }

    setCurrentDate() {
        const dateInput = document.getElementById('transactionDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
    }

    updateCategoryOptions(type) {
        const categorySelect = document.getElementById('transactionCategory');
        if (!categorySelect) return;

        // Clear existing options
        categorySelect.innerHTML = '<option value="">Select Category</option>';

        if (type && this.categories[type]) {
            this.categories[type].forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        }

        console.log(`Updated categories for ${type}:`, this.categories[type]);
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const transactionType = formData.get('transactionType');
        const amount = parseFloat(formData.get('transactionAmount'));
        const category = formData.get('transactionCategory');
        const date = formData.get('transactionDate');
        const description = formData.get('transactionDescription');

        // Validation
        if (!transactionType || !amount || !category || !date) {
            alert('Please fill in all required fields');
            return;
        }

        if (amount <= 0) {
            alert('Amount must be greater than 0');
            return;
        }

        const transaction = {
            id: Date.now(),
            date: date,
            amount: amount,
            category: category,
            type: transactionType,
            description: description || category
        };

        this.addTransaction(transaction);
        this.resetForm();
        this.showMessage('Transaction added successfully!');
    }

    addTransaction(transaction) {
        this.transactions.unshift(transaction);
        this.updateDashboard();
        this.renderTransactions();
        this.updateCharts();
    }

    resetForm() {
        const form = document.getElementById('transactionForm');
        if (form) {
            form.reset();
        }
        
        const categorySelect = document.getElementById('transactionCategory');
        if (categorySelect) {
            categorySelect.innerHTML = '<option value="">Select Category</option>';
        }
        
        this.setCurrentDate();
    }

    updateDashboard() {
        const today = new Date().toISOString().split('T')[0];
        
        // Calculate totals
        const totalIncome = this.transactions
            .filter(t => t.type === 'credit')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = this.transactions
            .filter(t => t.type === 'debit')
            .reduce((sum, t) => sum + t.amount, 0);

        const todayIncome = this.transactions
            .filter(t => t.type === 'credit' && t.date === today)
            .reduce((sum, t) => sum + t.amount, 0);

        const todayExpenses = this.transactions
            .filter(t => t.type === 'debit' && t.date === today)
            .reduce((sum, t) => sum + t.amount, 0);

        const currentBalance = totalIncome - totalExpenses;

        // Update display
        this.updateElement('currentBalance', this.formatCurrency(currentBalance));
        this.updateElement('totalIncome', this.formatCurrency(totalIncome));
        this.updateElement('totalExpenses', this.formatCurrency(totalExpenses));
        this.updateElement('todayIncome', this.formatCurrency(todayIncome));
        this.updateElement('todayExpenses', this.formatCurrency(todayExpenses));
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    renderTransactions() {
        const container = document.getElementById('transactionsList');
        if (!container) return;

        const recentTransactions = this.transactions.slice(0, 10);

        if (recentTransactions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No transactions yet. Add your first transaction above!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recentTransactions.map(transaction => {
            const formattedDate = new Date(transaction.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });

            return `
                <div class="transaction-item">
                    <div class="transaction-details">
                        <div class="transaction-description">${transaction.description}</div>
                        <div class="transaction-category">${transaction.category}</div>
                    </div>
                    <div class="transaction-meta">
                        <div class="transaction-amount ${transaction.type}">
                            ${transaction.type === 'credit' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
                        </div>
                        <div class="transaction-date">${formattedDate}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    initializeCharts() {
        if (typeof Chart === 'undefined') {
            console.log('Chart.js not loaded');
            return;
        }

        this.createExpenseChart();
        this.createIncomeExpenseChart();
    }

    createExpenseChart() {
        const canvas = document.getElementById('expenseChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const expenseData = this.getExpenseByCategory();
        
        if (expenseData.length === 0) {
            // Create a placeholder chart
            this.charts.expenseChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['No Data'],
                    datasets: [{
                        data: [1],
                        backgroundColor: ['#E0E0E0'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: false
                        }
                    }
                }
            });
            return;
        }

        const labels = expenseData.map(item => item.category);
        const data = expenseData.map(item => item.amount);
        const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];

        this.charts.expenseChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, data.length),
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${this.formatCurrency(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    createIncomeExpenseChart() {
        const canvas = document.getElementById('incomeExpenseChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const monthlyData = this.getMonthlyData();

        this.charts.incomeExpenseChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: monthlyData.labels,
                datasets: [
                    {
                        label: 'Income',
                        data: monthlyData.income,
                        backgroundColor: '#1FB8CD',
                        borderRadius: 4
                    },
                    {
                        label: 'Expenses',
                        data: monthlyData.expenses,
                        backgroundColor: '#B4413C',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${this.formatCurrency(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                }
            }
        });
    }

    getExpenseByCategory() {
        const expenseTransactions = this.transactions.filter(t => t.type === 'debit');
        const categoryTotals = {};

        expenseTransactions.forEach(transaction => {
            if (categoryTotals[transaction.category]) {
                categoryTotals[transaction.category] += transaction.amount;
            } else {
                categoryTotals[transaction.category] = transaction.amount;
            }
        });

        return Object.entries(categoryTotals)
            .map(([category, amount]) => ({ category, amount }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 8); // Show top 8 categories
    }

    getMonthlyData() {
        // For demo purposes, show last 6 months with current data
        const months = [];
        const income = [];
        const expenses = [];
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthName = date.toLocaleDateString('en-IN', { month: 'short' });
            const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
            
            months.push(monthName);
            
            // Calculate income and expenses for this month
            const monthIncome = this.transactions
                .filter(t => t.type === 'credit' && t.date.startsWith(monthKey))
                .reduce((sum, t) => sum + t.amount, 0);
            
            const monthExpenses = this.transactions
                .filter(t => t.type === 'debit' && t.date.startsWith(monthKey))
                .reduce((sum, t) => sum + t.amount, 0);
            
            income.push(monthIncome || (i === 0 ? 50000 : Math.random() * 40000 + 10000)); // Add some demo data
            expenses.push(monthExpenses || (i === 0 ? 2105 : Math.random() * 20000 + 5000)); // Add some demo data
        }

        return {
            labels: months,
            income: income,
            expenses: expenses
        };
    }

    updateCharts() {
        if (this.charts.expenseChart) {
            const expenseData = this.getExpenseByCategory();
            if (expenseData.length > 0) {
                this.charts.expenseChart.data.labels = expenseData.map(item => item.category);
                this.charts.expenseChart.data.datasets[0].data = expenseData.map(item => item.amount);
                this.charts.expenseChart.data.datasets[0].backgroundColor = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325'].slice(0, expenseData.length);
                this.charts.expenseChart.update();
            }
        }

        if (this.charts.incomeExpenseChart) {
            const monthlyData = this.getMonthlyData();
            this.charts.incomeExpenseChart.data.datasets[0].data = monthlyData.income;
            this.charts.incomeExpenseChart.data.datasets[1].data = monthlyData.expenses;
            this.charts.incomeExpenseChart.update();
        }
    }

    showMessage(message) {
        // Simple alert for now - could be enhanced with better notifications
        alert(message);
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SimpleFinanceTracker();
});
