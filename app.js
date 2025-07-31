// Daily Finance Tracker Application - Indian Edition
class DailyFinanceTracker {
    constructor() {
        // Sample transactions with Indian data
        this.transactions = [
            {
                id: 1,
                date: "2025-07-31",
                amount: 50000,
                category: "Salary",
                type: "income",
                description: "Monthly salary",
                timestamp: "2025-07-31T09:00:00"
            },
            {
                id: 2,
                date: "2025-07-31",
                amount: 25,
                category: "Chai/Tea & Coffee",
                type: "expense",
                description: "Evening chai",
                timestamp: "2025-07-31T17:30:00"
            },
            {
                id: 3,
                date: "2025-07-31",
                amount: 80,
                category: "Auto/Rickshaw",
                type: "expense",
                description: "Auto to office",
                timestamp: "2025-07-31T09:15:00"
            },
            {
                id: 4,
                date: "2025-07-30",
                amount: 15,
                category: "Street Food",
                type: "expense",
                description: "Samosa",
                timestamp: "2025-07-30T16:00:00"
            },
            {
                id: 5,
                date: "2025-07-30",
                amount: 2000,
                category: "Groceries/Sabzi",
                type: "expense",
                description: "Weekly groceries",
                timestamp: "2025-07-30T10:30:00"
            },
            {
                id: 6,
                date: "2025-07-29",
                amount: 45,
                category: "Metro/Bus Transport",
                type: "expense",
                description: "Metro day pass",
                timestamp: "2025-07-29T08:00:00"
            }
        ];

        this.nextId = 7;
        this.charts = {};
        this.deleteTransactionId = null;

        // Indian-specific categories
        this.incomeCategories = ["Salary", "Freelance Work", "Gifts/Bonus", "Investments", "Business Income"];
        this.expenseCategories = [
            "Chai/Tea & Coffee", "Auto/Rickshaw", "Street Food", "Metro/Bus Transport",
            "Mobile Recharge", "Domestic Help", "Groceries/Sabzi", "Medical/Hospital",
            "Petrol/Fuel", "Electricity Bill", "Internet/WiFi", "Clothing/Shopping",
            "Entertainment/Movies", "Dining Out", "EMI/Loans"
        ];

        // Indian category icons
        this.categoryIcons = {
            // Income
            "Salary": "💰",
            "Freelance Work": "💼",
            "Gifts/Bonus": "🎁",
            "Investments": "📈",
            "Business Income": "🏪",
            // Expenses
            "Chai/Tea & Coffee": "🍵",
            "Auto/Rickshaw": "🛺",
            "Street Food": "🥘",
            "Metro/Bus Transport": "🚌",
            "Mobile Recharge": "📱",
            "Domestic Help": "🏠",
            "Groceries/Sabzi": "🥬",
            "Medical/Hospital": "🏥",
            "Petrol/Fuel": "⛽",
            "Electricity Bill": "⚡",
            "Internet/WiFi": "📶",
            "Clothing/Shopping": "👕",
            "Entertainment/Movies": "🎬",
            "Dining Out": "🍽️",
            "EMI/Loans": "💳"
        };

        this.init();
    }

    init() {
        console.log('Initializing Daily Finance Tracker - Indian Edition...');
        this.setDefaultDate();
        this.setupEventListeners();
        this.updateDashboard();
        this.renderTransactions();
        this.updateInsights();
        
        // Create charts after DOM is ready
        setTimeout(() => {
            this.createCharts();
        }, 300);
        
        // Focus on amount input for quick entry
        setTimeout(() => {
            const amountInput = document.getElementById('amount');
            if (amountInput) {
                amountInput.focus();
            }
        }, 100);
    }

    setDefaultDate() {
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Transaction form submission
        const form = document.getElementById('transactionForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addTransaction();
            });
        }

        // Amount input - fix input issues
        const amountInput = document.getElementById('amount');
        if (amountInput) {
            // Clear placeholder and allow input
            amountInput.addEventListener('focus', () => {
                if (amountInput.value === '0.00' || amountInput.value === '') {
                    amountInput.value = '';
                }
            });
            
            // Format on blur
            amountInput.addEventListener('blur', () => {
                if (amountInput.value === '') {
                    amountInput.value = '';
                } else {
                    const value = parseFloat(amountInput.value);
                    if (!isNaN(value)) {
                        amountInput.value = value.toString();
                    }
                }
            });

            // Only allow numbers and decimal point
            amountInput.addEventListener('input', (e) => {
                let value = e.target.value;
                // Remove any non-numeric characters except decimal point
                value = value.replace(/[^0-9.]/g, '');
                // Only allow one decimal point
                const parts = value.split('.');
                if (parts.length > 2) {
                    value = parts[0] + '.' + parts.slice(1).join('');
                }
                e.target.value = value;
            });
        }

        // Quick amount buttons - fix functionality
        const quickButtons = document.querySelectorAll('.quick-btn');
        quickButtons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const amount = btn.getAttribute('data-amount');
                const amountInput = document.getElementById('amount');
                if (amountInput && amount) {
                    amountInput.value = amount;
                    amountInput.focus();
                }
            });
        });

        // Modal event listeners
        this.setupModalListeners();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && document.activeElement?.id === 'amount') {
                const categorySelect = document.getElementById('category');
                if (categorySelect && categorySelect.value) {
                    e.preventDefault();
                    this.addTransaction();
                } else if (categorySelect) {
                    e.preventDefault();
                    categorySelect.focus();
                }
            }
        });

        console.log('Event listeners setup complete');
    }

    addTransaction() {
        console.log('Adding transaction...');
        
        const amountInput = document.getElementById('amount');
        const categorySelect = document.getElementById('category');
        const dateInput = document.getElementById('date');
        const descriptionInput = document.getElementById('description');
        
        const amountValue = amountInput?.value?.trim() || '';
        const amount = parseFloat(amountValue);
        const category = categorySelect?.value || '';
        const date = dateInput?.value || '';
        const description = descriptionInput?.value?.trim() || '';

        console.log('Form values:', { amountValue, amount, category, date, description });

        // Validation
        if (!amountValue || isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            if (amountInput) {
                amountInput.focus();
                amountInput.select();
            }
            return;
        }

        if (!category) {
            alert('Please select a category');
            if (categorySelect) categorySelect.focus();
            return;
        }

        if (!date) {
            alert('Please select a date');
            if (dateInput) dateInput.focus();
            return;
        }

        // Determine transaction type based on category
        const type = this.incomeCategories.includes(category) ? 'income' : 'expense';

        // Create new transaction
        const transaction = {
            id: this.nextId++,
            date: date,
            amount: amount,
            category: category,
            type: type,
            description: description || category,
            timestamp: new Date().toISOString()
        };

        console.log('New transaction:', transaction);

        // Add to transactions array
        this.transactions.unshift(transaction); // Add to beginning for recent first

        // Show success feedback
        this.showSuccessFeedback();

        // Update all displays
        this.updateDashboard();
        this.renderTransactions();
        this.updateCharts();
        this.updateInsights();

        // Reset form
        if (amountInput) amountInput.value = '';
        if (categorySelect) categorySelect.selectedIndex = 0;
        if (descriptionInput) descriptionInput.value = '';
        this.setDefaultDate();
        
        // Focus back to amount input for quick next entry
        setTimeout(() => {
            if (amountInput) amountInput.focus();
        }, 100);

        console.log('Transaction added successfully');
    }

    showSuccessFeedback() {
        const form = document.getElementById('transactionForm');
        if (form) {
            form.classList.add('success');
            setTimeout(() => {
                form.classList.remove('success');
            }, 1000);
        }
    }

    deleteTransaction(id) {
        console.log(`Deleting transaction ${id}`);
        this.deleteTransactionId = id;
        const modal = document.getElementById('deleteModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    confirmDelete() {
        if (this.deleteTransactionId) {
            console.log(`Confirming delete of transaction ${this.deleteTransactionId}`);
            this.transactions = this.transactions.filter(t => t.id !== this.deleteTransactionId);
            
            // Update all displays
            this.updateDashboard();
            this.renderTransactions();
            this.updateCharts();
            this.updateInsights();
            
            this.deleteTransactionId = null;
            console.log('Transaction deleted successfully');
        }
        
        const modal = document.getElementById('deleteModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    setupModalListeners() {
        const modal = document.getElementById('deleteModal');
        const cancelBtn = document.getElementById('cancelDelete');
        const confirmBtn = document.getElementById('confirmDelete');
        const backdrop = modal?.querySelector('.modal-backdrop');

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                if (modal) modal.classList.add('hidden');
                this.deleteTransactionId = null;
            });
        }

        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                this.confirmDelete();
            });
        }

        if (backdrop) {
            backdrop.addEventListener('click', () => {
                if (modal) modal.classList.add('hidden');
                this.deleteTransactionId = null;
            });
        }

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
                this.deleteTransactionId = null;
            }
        });
    }

    updateDashboard() {
        const today = new Date().toISOString().split('T')[0];
        const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        const thisYear = new Date().getFullYear().toString();

        // Today's totals
        const todayTransactions = this.transactions.filter(t => t.date === today);
        const todayIncome = todayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const todayExpenses = todayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const todayBalance = todayIncome - todayExpenses;

        // Monthly totals
        const monthlyTransactions = this.transactions.filter(t => t.date.startsWith(thisMonth));
        const monthlyIncome = monthlyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const monthlyExpenses = monthlyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const monthlySavings = monthlyIncome - monthlyExpenses;

        // Annual totals
        const annualTransactions = this.transactions.filter(t => t.date.startsWith(thisYear));
        const annualIncome = annualTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const annualExpenses = annualTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const savingsRate = annualIncome > 0 ? ((annualIncome - annualExpenses) / annualIncome * 100) : 0;

        // Update DOM elements
        this.updateElement('todayIncome', this.formatIndianCurrency(todayIncome));
        this.updateElement('todayExpenses', this.formatIndianCurrency(todayExpenses));
        this.updateElement('todayBalance', this.formatIndianCurrency(todayBalance));

        this.updateElement('monthlyIncome', this.formatIndianCurrency(monthlyIncome));
        this.updateElement('monthlyExpenses', this.formatIndianCurrency(monthlyExpenses));
        this.updateElement('monthlySavings', this.formatIndianCurrency(monthlySavings));

        this.updateElement('annualIncome', this.formatIndianCurrency(annualIncome));
        this.updateElement('annualExpenses', this.formatIndianCurrency(annualExpenses));
        this.updateElement('savingsRate', `${savingsRate.toFixed(1)}%`);

        // Color coding for balances
        this.updateBalanceColor('todayBalance', todayBalance);
        this.updateBalanceColor('monthlySavings', monthlySavings);
    }

    updateBalanceColor(elementId, amount) {
        const element = document.getElementById(elementId);
        if (element) {
            element.className = element.className.replace(/\b(income|expense|balance)\b/g, '');
            element.classList.add('stat-value');
            if (amount > 0) {
                element.classList.add('income');
            } else if (amount < 0) {
                element.classList.add('expense');
            } else {
                element.classList.add('balance');
            }
        }
    }

    renderTransactions() {
        const container = document.getElementById('transactionsList');
        const emptyState = document.getElementById('emptyState');
        const transactionCount = document.getElementById('transactionCount');

        if (!container) return;

        // Update transaction count
        if (transactionCount) {
            const count = this.transactions.length;
            transactionCount.textContent = `${count} transaction${count !== 1 ? 's' : ''}`;
        }

        if (this.transactions.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📊</div>
                    <h4>No transactions yet</h4>
                    <p>Start logging your daily transactions above</p>
                </div>
            `;
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        // Show last 15 transactions
        const recentTransactions = this.transactions.slice(0, 15);
        
        container.innerHTML = recentTransactions.map(transaction => {
            const icon = this.categoryIcons[transaction.category] || '💰';
            const typeClass = transaction.type;
            const amountPrefix = transaction.type === 'income' ? '+' : '-';
            const formattedDate = this.formatDate(transaction.date);
            
            return `
                <div class="transaction-item" data-id="${transaction.id}">
                    <div class="transaction-main">
                        <div class="transaction-icon ${typeClass}">
                            ${icon}
                        </div>
                        <div class="transaction-details">
                            <div class="transaction-description">${transaction.description}</div>
                            <div class="transaction-meta">${transaction.category} • ${formattedDate}</div>
                        </div>
                    </div>
                    <div class="transaction-amount ${typeClass}">
                        ${amountPrefix}${this.formatIndianCurrency(transaction.amount)}
                    </div>
                    <div class="transaction-actions">
                        <button class="action-btn" onclick="tracker.deleteTransaction(${transaction.id})" title="Delete transaction">
                            🗑️
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    createCharts() {
        this.createExpenseChart();
        this.createIncomeExpenseChart();
        this.createTrendChart();
    }

    updateCharts() {
        // Destroy existing charts
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.charts = {};
        
        // Recreate charts with new data
        setTimeout(() => {
            this.createCharts();
        }, 100);
    }

    createExpenseChart() {
        const canvas = document.getElementById('expenseChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const thisMonth = new Date().toISOString().slice(0, 7);
        
        // Get monthly expense breakdown
        const monthlyExpenses = this.transactions
            .filter(t => t.date.startsWith(thisMonth) && t.type === 'expense')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {});

        const labels = Object.keys(monthlyExpenses);
        const values = Object.values(monthlyExpenses);
        const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];

        if (labels.length === 0) {
            // Show empty chart message
            const emptyData = {
                labels: ['No Data'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['#E5E5E5'],
                    borderWidth: 0
                }]
            };
            
            this.charts.expenseChart = new Chart(ctx, {
                type: 'pie',
                data: emptyData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false }
                    }
                }
            });
            return;
        }

        this.charts.expenseChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 15
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${this.formatIndianCurrency(value)} (${percentage}%)`;
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
        const thisMonth = new Date().toISOString().slice(0, 7);
        
        // Get monthly totals
        const monthlyTransactions = this.transactions.filter(t => t.date.startsWith(thisMonth));
        const monthlyIncome = monthlyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const monthlyExpenses = monthlyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

        // Get annual totals
        const thisYear = new Date().getFullYear().toString();
        const annualTransactions = this.transactions.filter(t => t.date.startsWith(thisYear));
        const annualIncome = annualTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const annualExpenses = annualTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

        this.charts.incomeExpenseChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['This Month', 'This Year'],
                datasets: [{
                    label: 'Income',
                    data: [monthlyIncome, annualIncome],
                    backgroundColor: '#1FB8CD',
                    borderRadius: 8
                }, {
                    label: 'Expenses',
                    data: [monthlyExpenses, annualExpenses],
                    backgroundColor: '#B4413C',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${this.formatIndianCurrency(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => this.formatIndianCurrency(value)
                        }
                    }
                }
            }
        });
    }

    createTrendChart() {
        const canvas = document.getElementById('trendChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Get last 30 days of data
        const last30Days = this.getLast30Days();
        const dailyBalances = last30Days.map(date => {
            const dayTransactions = this.transactions.filter(t => t.date === date);
            const dayIncome = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const dayExpenses = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
            return dayIncome - dayExpenses;
        });

        // Calculate running balance
        let runningBalance = 0;
        const runningBalances = dailyBalances.map(daily => {
            runningBalance += daily;
            return runningBalance;
        });

        this.charts.trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last30Days.map(date => this.formatDateShort(date)),
                datasets: [{
                    label: 'Running Balance',
                    data: runningBalances,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointBackgroundColor: '#1FB8CD',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
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
                        callbacks: {
                            label: (context) => {
                                return `Balance: ${this.formatIndianCurrency(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: (value) => this.formatIndianCurrency(value)
                        }
                    },
                    x: {
                        ticks: {
                            maxTicksLimit: 10
                        }
                    }
                }
            }
        });
    }

    updateInsights() {
        // Calculate insights
        const thisMonth = new Date().toISOString().slice(0, 7);
        const monthlyTransactions = this.transactions.filter(t => t.date.startsWith(thisMonth));
        const monthlyExpenses = monthlyTransactions.filter(t => t.type === 'expense');
        
        // Average daily spending
        const daysInMonth = new Date().getDate();
        const totalMonthlyExpenses = monthlyExpenses.reduce((sum, t) => sum + t.amount, 0);
        const avgDailySpending = daysInMonth > 0 ? totalMonthlyExpenses / daysInMonth : 0;

        // Top expense category
        const categoryTotals = monthlyExpenses.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});
        
        const topCategory = Object.keys(categoryTotals).length > 0 
            ? Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b) 
            : '-';

        // Days remaining in month
        const today = new Date();
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const daysRemaining = lastDayOfMonth - today.getDate();

        // Monthly transaction count
        const monthlyTransactionCount = monthlyTransactions.length;

        // Update DOM
        this.updateElement('avgDailySpending', this.formatIndianCurrency(avgDailySpending));
        this.updateElement('topCategory', topCategory);
        this.updateElement('daysRemaining', daysRemaining.toString());
        this.updateElement('monthlyTransactions', monthlyTransactionCount.toString());
    }

    getLast30Days() {
        const days = [];
        const today = new Date();
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }
        
        return days;
    }

    formatIndianCurrency(amount) {
        // Format currency in Indian style with ₹ symbol
        const absAmount = Math.abs(amount);
        
        // Convert to Indian numbering system (lakhs, crores)
        if (absAmount >= 10000000) {
            // Crores
            const crores = (absAmount / 10000000).toFixed(2);
            return `₹${crores}Cr`;
        } else if (absAmount >= 100000) {
            // Lakhs
            const lakhs = (absAmount / 100000).toFixed(2);
            return `₹${lakhs}L`;
        } else if (absAmount >= 1000) {
            // Thousands with Indian comma formatting
            return `₹${absAmount.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        } else {
            // Less than 1000
            return `₹${absAmount.toFixed(2)}`;
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (dateString === today.toISOString().split('T')[0]) {
            return 'Today';
        } else if (dateString === yesterday.toISOString().split('T')[0]) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        }
    }

    formatDateShort(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { month: 'numeric', day: 'numeric' });
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
}

// Global reference for delete buttons
let tracker;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Daily Finance Tracker - Indian Edition...');
    tracker = new DailyFinanceTracker();
});