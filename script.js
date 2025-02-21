// Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Update active navigation link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});

// Modal Management
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close button functionality for all modals
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.onclick = function() {
        const modal = this.closest('.modal');
        hideModal(modal.id);
    };
});

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        hideModal(event.target.id);
    }
    const modal = document.getElementById('salesModal');
    if (event.target == modal) {
        closeSalesModal();
    }
}

// Get Started Button
document.getElementById("get-started-btn").onclick = function() {
    showModal('login-section');
};

// Login Options
document.getElementById("google-login").onclick = function() {
    // Google Login Implementation
    alert("Google login will be implemented here");
    hideModal('login-section');
    showModal('application-section');
};

document.getElementById("fb-login").onclick = function() {
    // Facebook Login Implementation
    alert("Facebook login will be implemented here");
    hideModal('login-section');
    showModal('application-section');
};

// Login Form
document.getElementById("login-form").onsubmit = function(e) {
    e.preventDefault();
    // Add login validation here
    hideModal('login-section');
    showModal('application-section');
};

// Application Form
document.getElementById("application-form").onsubmit = function(event) {
    event.preventDefault();
    
    // Form Validation
    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        position: document.getElementById("position").value,
        message: document.getElementById("message").value
    };

    // File handling for resume
    const resumeFile = document.getElementById("resume").files[0];
    if (resumeFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            formData.resume = e.target.result;
            submitApplication(formData);
        };
        reader.readAsDataURL(resumeFile);
    } else {
        submitApplication(formData);
    }
};

function submitApplication(formData) {
    // Here you would typically send the data to your server
    console.log("Submitting application:", formData);
    alert("Thank you for your application! We will contact you soon.");
    
    // Reset form and close modal
    document.getElementById("application-form").reset();
    hideModal('application-section');
}

// Contact Form
document.getElementById("contact-form").onsubmit = function(e) {
    e.preventDefault();
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;

    // Here you would typically send the contact form data to your server
    console.log("Contact form submission:", { name, email, message });
    alert("Thank you for your message! We will get back to you soon.");
    
    this.reset();
};

// Sales data storage
let salesData = [];

// Function to open the sales modal
function openSalesModal() {
    const modal = document.getElementById('salesModal');
    modal.style.display = 'block';
    loadSavedSales();
}

// Function to close the sales modal
function closeSalesModal() {
    const modal = document.getElementById('salesModal');
    modal.style.display = 'none';
}

// Auto-save when input changes
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.sales-input');
    
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            saveSales();
        });
    });
    
    // Load saved data when page loads
    loadSavedSales();
});

// Save sales data
function saveSales() {
    const inputs = document.querySelectorAll('.sales-input');
    const salesData = {};
    
    inputs.forEach((input, index) => {
        const row = input.closest('tr');
        const agentName = row.querySelector('.person-name').textContent;
        const date = document.querySelector('.date-header').children[Math.floor(index % 5) + 1].textContent;
        
        if (!salesData[agentName]) {
            salesData[agentName] = {};
        }
        
        salesData[agentName][date] = input.value || '0';
    });
    
    localStorage.setItem('salesData', JSON.stringify(salesData));
}

// Load saved sales data
function loadSavedSales() {
    const savedData = localStorage.getItem('salesData');
    if (savedData) {
        const salesData = JSON.parse(savedData);
        const inputs = document.querySelectorAll('.sales-input');
        
        inputs.forEach((input, index) => {
            const row = input.closest('tr');
            const agentName = row.querySelector('.person-name').textContent;
            const date = document.querySelector('.date-header').children[Math.floor(index % 5) + 1].textContent;
            
            if (salesData[agentName] && salesData[agentName][date]) {
                input.value = salesData[agentName][date];
            }
        });
    }
}

// Show sales form modal
function showSalesForm() {
    const modal = document.getElementById('salesFormModal');
    modal.style.display = 'block';
    document.getElementById('salesDate').valueAsDate = new Date();
}

// Initialize weekly data structure
function initializeWeeklyData() {
    return {
        Monday: { newCalls: 0, followUp: 0 },
        Tuesday: { newCalls: 0, followUp: 0 },
        Wednesday: { newCalls: 0, followUp: 0 },
        Thursday: { newCalls: 0, followUp: 0 },
        Friday: { newCalls: 0, followUp: 0 }
    };
}

// Display sales entries in weekly format
function displaySalesEntries(entries) {
    const container = document.getElementById('salesEntries');
    container.innerHTML = '';
    
    // Group data by agent
    const agentData = {};
    
    entries.forEach(entry => {
        if (!agentData[entry.agent]) {
            agentData[entry.agent] = initializeWeeklyData();
        }
        
        const date = new Date(entry.date);
        const day = date.toLocaleString('en-US', { weekday: 'long' });
        
        if (agentData[entry.agent][day]) {
            if (entry.callType === 'New Call') {
                agentData[entry.agent][day].newCalls++;
            } else {
                agentData[entry.agent][day].followUp++;
            }
        }
    });
    
    // Create rows for each agent
    for (const agent in agentData) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${agent}</td>
            <td>${agentData[agent].Monday.newCalls}</td>
            <td>${agentData[agent].Monday.followUp}</td>
            <td>${agentData[agent].Tuesday.newCalls}</td>
            <td>${agentData[agent].Tuesday.followUp}</td>
            <td>${agentData[agent].Wednesday.newCalls}</td>
            <td>${agentData[agent].Wednesday.followUp}</td>
            <td>${agentData[agent].Thursday.newCalls}</td>
            <td>${agentData[agent].Thursday.followUp}</td>
            <td>${agentData[agent].Friday.newCalls}</td>
            <td>${agentData[agent].Friday.followUp}</td>
        `;
        container.appendChild(row);
    }
    
    updateWeeklyTotal(entries);
}

// Update weekly total
function updateWeeklyTotal(entries) {
    const total = entries.reduce((sum, entry) => sum + 1, 0);
    document.getElementById('weeklyTotal').textContent = `Total Calls: ${total}`;
}

// Filter by week
function filterWeek() {
    const weekFilter = document.getElementById('weekFilter').value;
    if (!weekFilter) return;

    const [year, week] = weekFilter.split('-W');
    const filtered = salesData.filter(entry => {
        const entryDate = new Date(entry.date);
        const entryWeek = getWeekNumber(entryDate);
        return entryWeek === parseInt(week) && entryDate.getFullYear() === parseInt(year);
    });
    
    displaySalesEntries(filtered);
}

// Get week number of date
function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('salesFormModal');
    const closeBtn = document.querySelector('.close-modal');

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    // Set current week as default for filter
    const now = new Date();
    const weekNumber = getWeekNumber(now);
    document.getElementById('weekFilter').value = 
        `${now.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;

    // Handle form submission
    document.getElementById('salesForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const entry = {
            date: document.getElementById('salesDate').value,
            agent: document.getElementById('agentName').value,
            callType: document.getElementById('callType').value,
            amount: document.getElementById('salesAmount').value
        };

        salesData.unshift(entry);
        displaySalesEntries(salesData);

        this.reset();
        document.getElementById('salesDate').valueAsDate = new Date();
    });
});

// Daily Sales Sheet
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date by default
    document.getElementById('date').valueAsDate = new Date();
    
    // Add first row by default
    addNewRow();
    
    // Add event listeners
    document.getElementById('addRow').addEventListener('click', addNewRow);
    document.getElementById('saveSheet').addEventListener('click', saveSheet);
    document.getElementById('newSheet').addEventListener('click', newSheet);
});

function addNewRow() {
    const tbody = document.getElementById('salesTableBody');
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td><input type="text" class="customer-name" placeholder="Customer name"></td>
        <td><input type="text" class="product" placeholder="Product/Service"></td>
        <td><input type="number" class="quantity" value="1" min="1"></td>
        <td><input type="number" class="price" value="0" min="0"></td>
        <td class="row-total">0</td>
        <td><button class="delete-button" onclick="deleteRow(this)">Delete</button></td>
    `;
    
    tbody.appendChild(row);
    
    // Add event listeners for calculation
    const inputs = row.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', calculateRowTotal);
    });
}

function calculateRowTotal(event) {
    const row = event.closest('tr');
    const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
    const price = parseFloat(row.querySelector('.price').value) || 0;
    const total = quantity * price;
    
    row.querySelector('.row-total').textContent = total.toFixed(2);
    calculateTotalSales();
}

function calculateTotalSales() {
    const totals = Array.from(document.querySelectorAll('.row-total'))
        .map(cell => parseFloat(cell.textContent) || 0);
    const grandTotal = totals.reduce((sum, val) => sum + val, 0);
    document.getElementById('totalSales').textContent = grandTotal.toFixed(2);
}

function deleteRow(button) {
    button.closest('tr').remove();
    calculateTotalSales();
}

function saveSheet() {
    const data = {
        date: document.getElementById('date').value,
        agentName: document.getElementById('agentName').value,
        sales: Array.from(document.getElementById('salesTableBody').rows).map(row => ({
            customerName: row.querySelector('.customer-name').value,
            product: row.querySelector('.product').value,
            quantity: row.querySelector('.quantity').value,
            price: row.querySelector('.price').value,
            total: row.querySelector('.row-total').textContent
        })),
        totalSales: document.getElementById('totalSales').textContent,
        notes: document.getElementById('notes').value
    };
    
    localStorage.setItem('salesSheet_' + data.date + '_' + data.agentName, JSON.stringify(data));
    alert('Sales sheet saved successfully!');
}

function newSheet() {
    if (confirm('Start a new sheet? Current data will be cleared.')) {
        document.getElementById('agentName').value = '';
        document.getElementById('date').valueAsDate = new Date();
        document.getElementById('notes').value = '';
        document.getElementById('salesTableBody').innerHTML = '';
        document.getElementById('totalSales').textContent = '0';
        addNewRow();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Set today's date by default
    document.getElementById('saleDate').valueAsDate = new Date();
    
    // Load saved sales
    loadSavedSales();
    updateTotals();
    
    // Add event listener for adding sales
    document.getElementById('addSale').addEventListener('click', addSale);
});

function addSale() {
    const agent = document.getElementById('agentSelect').value;
    const date = document.getElementById('saleDate').value;
    const customer = document.getElementById('customerName').value;
    const product = document.getElementById('productService').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;
    
    if (!agent) {
        alert('Please select your name');
        return;
    }
    
    if (!customer || !product) {
        alert('Please fill in all fields');
        return;
    }
    
    const total = quantity * price;
    const time = new Date().toLocaleTimeString();
    
    // Add to sales list
    const salesList = document.getElementById('salesList');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${agent}</td>
        <td>${time}</td>
        <td>${customer}</td>
        <td>${product}</td>
        <td>${quantity}</td>
        <td>${price}</td>
        <td>${total.toFixed(2)}</td>
    `;
    salesList.appendChild(row);
    
    // Save to localStorage
    saveSale({
        agent,
        date,
        time,
        customer,
        product,
        quantity,
        price,
        total
    });
    
    // Update totals
    updateTotals();
    
    // Clear form
    document.getElementById('customerName').value = '';
    document.getElementById('productService').value = '';
    document.getElementById('quantity').value = '1';
    document.getElementById('price').value = '0';
}

function saveSale(sale) {
    let sales = JSON.parse(localStorage.getItem('sales') || '[]');
    sales.push(sale);
    localStorage.setItem('sales', JSON.stringify(sales));
}

function loadSavedSales() {
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const today = new Date().toLocaleDateString();
    const salesList = document.getElementById('salesList');
    
    salesList.innerHTML = '';
    
    sales.filter(sale => sale.date === today).forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.agent}</td>
            <td>${sale.time}</td>
            <td>${sale.customer}</td>
            <td>${sale.product}</td>
            <td>${sale.quantity}</td>
            <td>${sale.price}</td>
            <td>${sale.total.toFixed(2)}</td>
        `;
        salesList.appendChild(row);
    });
}

function updateTotals() {
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const today = new Date().toLocaleDateString();
    const totalsList = document.getElementById('totalsList');
    const agents = {};
    
    // Calculate totals for each agent
    sales.filter(sale => sale.date === today).forEach(sale => {
        if (!agents[sale.agent]) {
            agents[sale.agent] = {
                totalSales: 0,
                numberOfSales: 0
            };
        }
        agents[sale.agent].totalSales += sale.total;
        agents[sale.agent].numberOfSales++;
    });
    
    // Display totals
    totalsList.innerHTML = '';
    for (const [agent, data] of Object.entries(agents)) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${agent}</td>
            <td>${data.totalSales.toFixed(2)}</td>
            <td>${data.numberOfSales}</td>
        `;
        totalsList.appendChild(row);
    }
}

// Function to get the week number
function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Function to format date as DD-MM-YYYY
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// Function to get the date range for the current week
function getWeekDateRange() {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    
    const weekStart = new Date(today.setDate(diff));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    return `${formatDate(weekStart)} / ${formatDate(weekEnd)}`;
}

// Initialize the header information
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    document.getElementById('weekNumber').textContent = getWeekNumber(today);
    document.getElementById('dateRange').textContent = getWeekDateRange();
});

document.addEventListener('DOMContentLoaded', function() {
    // Set today's date by default
    document.getElementById('date').valueAsDate = new Date();

    // Add new sale row
    document.getElementById('addRow').addEventListener('click', addSaleRow);

    // Clear all data
    document.getElementById('clearAll').addEventListener('click', clearAllData);

    // Initialize event listeners for total customers
    document.getElementById('totalCustomers').addEventListener('input', updateConversionRate);
});

function clearAllData() {
    // Clear table rows
    document.getElementById('salesTableBody').innerHTML = '';
    
    // Reset form fields
    document.getElementById('agentName').value = '';
    document.getElementById('totalCustomers').value = '';
    document.getElementById('reflection').value = '';
    document.getElementById('signature').value = '';
    
    // Reset summary values
    document.getElementById('totalSales').textContent = '0.00';
    document.getElementById('conversionRate').textContent = '0%';
    
    // Reset date to today
    document.getElementById('date').valueAsDate = new Date();
}

function addSaleRow() {
    const tbody = document.getElementById('salesTableBody');
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td><input type="text" class="customer-name" placeholder="Customer Name"></td>
        <td><input type="text" class="product" placeholder="Product/Service"></td>
        <td><input type="number" class="quantity" value="1" min="1"></td>
        <td><input type="number" class="price" value="0.00" step="0.01"></td>
        <td class="total">0.00</td>
        <td><button class="delete-row">Delete</button></td>
    `;

    tbody.appendChild(row);

    // Add event listeners to new row
    const quantity = row.querySelector('.quantity');
    const price = row.querySelector('.price');
    const deleteBtn = row.querySelector('.delete-row');

    quantity.addEventListener('input', () => calculateRowTotal(row));
    price.addEventListener('input', () => calculateRowTotal(row));
    deleteBtn.addEventListener('click', () => {
        row.remove();
        updateTotalSales();
        updateConversionRate();
    });
}

function calculateRowTotal(row) {
    const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
    const price = parseFloat(row.querySelector('.price').value) || 0;
    const total = quantity * price;
    row.querySelector('.total').textContent = total.toFixed(2);
    updateTotalSales();
}

function updateTotalSales() {
    const totals = Array.from(document.querySelectorAll('.total'))
        .map(el => parseFloat(el.textContent) || 0);
    const sum = totals.reduce((a, b) => a + b, 0);
    document.getElementById('totalSales').textContent = sum.toFixed(2);
    updateConversionRate();
}

function updateConversionRate() {
    const totalCustomers = parseInt(document.getElementById('totalCustomers').value) || 0;
    const salesCount = document.querySelectorAll('#salesTableBody tr').length;
    
    if (totalCustomers > 0) {
        const rate = (salesCount / totalCustomers) * 100;
        document.getElementById('conversionRate').textContent = rate.toFixed(1) + '%';
    } else {
        document.getElementById('conversionRate').textContent = '0%';
    }
}

// Set today's date when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    document.getElementById('entryDate').valueAsDate = today;
    
    // Add event listeners
    document.getElementById('addAgent').addEventListener('click', addNewAgent);
    document.getElementById('saveSales').addEventListener('click', saveSalesData);
    document.getElementById('clearSales').addEventListener('click', clearSalesData);
    
    // Load any saved data
    loadSavedData();
});

function addNewAgent() {
    const agentName = document.getElementById('newAgent').value.trim();
    if (!agentName) {
        alert('Please enter an agent name');
        return;
    }
    
    const tbody = document.getElementById('salesTableBody');
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${agentName}</td>
        <td><input type="number" class="sales-amount" min="0" value="0"></td>
        <td><button class="delete-btn" onclick="deleteAgent(this)">Delete</button></td>
    `;
    
    tbody.appendChild(row);
    document.getElementById('newAgent').value = '';
    updateTotals();
}

function deleteAgent(button) {
    button.closest('tr').remove();
    updateTotals();
}

function updateTotals() {
    const rows = document.getElementById('salesTableBody').getElementsByTagName('tr');
    let totalSales = 0;
    
    for (let row of rows) {
        const salesInput = row.querySelector('.sales-amount');
        totalSales += Number(salesInput.value) || 0;
    }
    
    document.getElementById('totalSalesAmount').textContent = totalSales;
    document.getElementById('totalAgents').textContent = rows.length;
}

function saveSalesData() {
    const date = document.getElementById('entryDate').value;
    const salesData = {
        date: date,
        agents: []
    };
    
    const rows = document.getElementById('salesTableBody').getElementsByTagName('tr');
    for (let row of rows) {
        salesData.agents.push({
            name: row.cells[0].textContent,
            sales: Number(row.querySelector('.sales-amount').value) || 0
        });
    }
    
    // Save to localStorage
    localStorage.setItem('salesData_' + date, JSON.stringify(salesData));
    alert('Sales data saved successfully!');
}

function loadSavedData() {
    const date = document.getElementById('entryDate').value;
    const savedData = localStorage.getItem('salesData_' + date);
    
    if (savedData) {
        const data = JSON.parse(savedData);
        const tbody = document.getElementById('salesTableBody');
        tbody.innerHTML = '';
        
        data.agents.forEach(agent => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${agent.name}</td>
                <td><input type="number" class="sales-amount" min="0" value="${agent.sales}"></td>
                <td><button class="delete-btn" onclick="deleteAgent(this)">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
        
        updateTotals();
    }
}

function clearSalesData() {
    if (confirm('Are you sure you want to clear all sales data?')) {
        document.getElementById('salesTableBody').innerHTML = '';
        document.getElementById('newAgent').value = '';
        updateTotals();
    }
}

// Add event listener for date change
document.getElementById('entryDate').addEventListener('change', loadSavedData);

// Add event listener for sales amount changes
document.addEventListener('input', function(e) {
    if (e.target.classList.contains('sales-amount')) {
        updateTotals();
    }
});

// Call Tracking and Proved Calls
document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    const today = new Date();
    document.getElementById('currentDate').textContent = today.toLocaleDateString();
    
    // Initialize event listeners
    document.getElementById('saveCall').addEventListener('click', saveCall);
    
    // Load today's data
    loadTodaysCalls();
});

function saveCall() {
    const customerName = document.getElementById('customerName').value.trim();
    const status = document.getElementById('callStatus').value;
    
    if (!customerName) {
        alert('Please enter customer name');
        return;
    }
    
    const currentTime = new Date().toLocaleTimeString();
    addCallToTable(currentTime, customerName, status);
    
    // Clear form
    document.getElementById('customerName').value = '';
    document.getElementById('callStatus').value = 'Proved';
    
    // Update counts
    updateCounts();
    
    // Save to localStorage
    saveTodaysCalls();
}

function addCallToTable(time, customerName, status) {
    const tbody = document.getElementById('callsTableBody');
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${time}</td>
        <td>${customerName}</td>
        <td class="${status.toLowerCase()}">${status}</td>
        <td>
            <button class="btn btn-sm" onclick="editCall(this)">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteCall(this)">Delete</button>
        </td>
    `;
    
    tbody.appendChild(row);
}

function editCall(button) {
    const row = button.closest('tr');
    const customerName = row.cells[1].textContent;
    const status = row.cells[2].textContent;
    
    document.getElementById('customerName').value = customerName;
    document.getElementById('callStatus').value = status;
    
    // Remove the old row as we'll add a new one when saved
    row.remove();
    updateCounts();
}

function deleteCall(button) {
    if (confirm('Are you sure you want to delete this call?')) {
        button.closest('tr').remove();
        updateCounts();
        saveTodaysCalls();
    }
}

function updateCounts() {
    const rows = document.getElementById('callsTableBody').getElementsByTagName('tr');
    let provedCount = 0;
    
    for (let row of rows) {
        if (row.cells[2].textContent === 'Proved') {
            provedCount++;
        }
    }
    
    document.getElementById('provedCallCount').textContent = provedCount;
    document.getElementById('totalCallCount').textContent = rows.length;
    document.getElementById('todaySales').textContent = provedCount;
}

function saveTodaysCalls() {
    const rows = document.getElementById('callsTableBody').getElementsByTagName('tr');
    const calls = [];
    
    for (let row of rows) {
        calls.push({
            time: row.cells[0].textContent,
            customerName: row.cells[1].textContent,
            status: row.cells[2].textContent
        });
    }
    
    const today = new Date().toLocaleDateString();
    localStorage.setItem('calls_' + today, JSON.stringify(calls));
}

function loadTodaysCalls() {
    const today = new Date().toLocaleDateString();
    const savedCalls = localStorage.getItem('calls_' + today);
    
    if (savedCalls) {
        const calls = JSON.parse(savedCalls);
        const tbody = document.getElementById('callsTableBody');
        tbody.innerHTML = '';
        
        calls.forEach(call => {
            addCallToTable(call.time, call.customerName, call.status);
        });
        
        updateCounts();
    }
}

// Monthly Sales Sheet Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set current month and year
    const today = new Date();
    document.getElementById('monthSelect').value = today.getMonth() + 1;
    document.getElementById('yearSelect').value = today.getFullYear();
    document.getElementById('salesDate').valueAsDate = today;
    
    // Add event listeners
    document.getElementById('loginBtn').addEventListener('click', loginAgent);
    document.getElementById('addSales').addEventListener('click', addSales);
    document.getElementById('monthSelect').addEventListener('change', loadMonthlySales);
    document.getElementById('yearSelect').addEventListener('change', loadMonthlySales);
});

function loginAgent() {
    const agentName = document.getElementById('agentName').value.trim();
    if (!agentName) {
        alert('Please enter your name');
        return;
    }
    
    document.getElementById('agentNameDisplay').textContent = agentName;
    document.getElementById('salesContent').style.display = 'block';
    loadMonthlySales();
}

function addSales() {
    const date = document.getElementById('salesDate').value;
    const sales = parseInt(document.getElementById('salesCount').value) || 0;
    const agentName = document.getElementById('agentName').value;
    
    if (!date) {
        alert('Please select a date');
        return;
    }
    
    // Check if date is within selected month/year
    const selectedMonth = document.getElementById('monthSelect').value;
    const selectedYear = document.getElementById('yearSelect').value;
    const salesDate = new Date(date);
    
    if (salesDate.getMonth() + 1 != selectedMonth || salesDate.getFullYear() != selectedYear) {
        alert('Please select a date within the current month/year');
        return;
    }
    
    saveSalesEntry(date, sales);
    loadMonthlySales();
    
    // Clear inputs
    document.getElementById('salesCount').value = '0';
}

function saveSalesEntry(date, sales) {
    const agentName = document.getElementById('agentName').value;
    const month = document.getElementById('monthSelect').value;
    const year = document.getElementById('yearSelect').value;
    const key = `sales_${agentName}_${year}_${month}`;
    
    let monthData = JSON.parse(localStorage.getItem(key) || '{}');
    monthData[date] = sales;
    
    localStorage.setItem(key, JSON.stringify(monthData));
}

function loadMonthlySales() {
    const agentName = document.getElementById('agentName').value;
    const month = document.getElementById('monthSelect').value;
    const year = document.getElementById('yearSelect').value;
    const key = `sales_${agentName}_${year}_${month}`;
    
    const monthData = JSON.parse(localStorage.getItem(key) || '{}');
    const tbody = document.getElementById('salesTableBody');
    tbody.innerHTML = '';
    
    let totalSales = 0;
    let bestDay = null;
    let bestSales = 0;
    
    Object.entries(monthData)
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .forEach(([date, sales]) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(date)}</td>
                <td>${sales}</td>
                <td>
                    <button class="edit-btn" onclick="editSales('${date}', ${sales})">Edit</button>
                    <button class="delete-btn" onclick="deleteSales('${date}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
            
            totalSales += sales;
            if (sales > bestSales) {
                bestSales = sales;
                bestDay = date;
            }
        });
    
    // Update summary
    document.getElementById('monthlyTotal').textContent = totalSales;
    document.getElementById('bestDay').textContent = bestDay ? formatDate(bestDay) + ` (${bestSales})` : '-';
    document.getElementById('daysWorked').textContent = Object.keys(monthData).length;
    document.getElementById('avgSales').textContent = Object.keys(monthData).length ? 
        (totalSales / Object.keys(monthData).length).toFixed(1) : '0';
}

function editSales(date, sales) {
    document.getElementById('salesDate').value = date;
    document.getElementById('salesCount').value = sales;
}

function deleteSales(date) {
    if (confirm('Are you sure you want to delete this entry?')) {
        const agentName = document.getElementById('agentName').value;
        const month = document.getElementById('monthSelect').value;
        const year = document.getElementById('yearSelect').value;
        const key = `sales_${agentName}_${year}_${month}`;
        
        let monthData = JSON.parse(localStorage.getItem(key) || '{}');
        delete monthData[date];
        
        localStorage.setItem(key, JSON.stringify(monthData));
        loadMonthlySales();
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

document.addEventListener('DOMContentLoaded', function() {
    // Set today's date as default
    document.getElementById('salesDate').valueAsDate = new Date();
    document.getElementById('filterDate').valueAsDate = new Date();
    
    // Add event listeners
    document.getElementById('addEntry').addEventListener('click', addSalesEntry);
    document.getElementById('searchAgent').addEventListener('input', filterSales);
    document.getElementById('filterDate').addEventListener('change', filterSales);
    document.getElementById('clearFilters').addEventListener('click', clearFilters);
    
    // Load existing entries
    loadSalesEntries();
});

function addSalesEntry() {
    const agentName = document.getElementById('agentName').value.trim();
    const date = document.getElementById('salesDate').value;
    const sales = parseInt(document.getElementById('salesCount').value) || 0;
    const remarks = document.getElementById('remarks').value.trim();
    
    if (!agentName) {
        alert('Please enter agent name');
        return;
    }
    
    if (!date) {
        alert('Please select date');
        return;
    }
    
    const entry = {
        id: Date.now(),
        agentName,
        date,
        sales,
        remarks,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    let entries = JSON.parse(localStorage.getItem('salesEntries') || '[]');
    entries.push(entry);
    localStorage.setItem('salesEntries', JSON.stringify(entries));
    
    // Clear form
    document.getElementById('salesCount').value = '0';
    document.getElementById('remarks').value = '';
    
    // Reload table
    loadSalesEntries();
}

function loadSalesEntries() {
    const entries = JSON.parse(localStorage.getItem('salesEntries') || '[]');
    const tbody = document.getElementById('salesTableBody');
    tbody.innerHTML = '';
    
    entries.sort((a, b) => new Date(b.date) - new Date(a.date))
          .forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(entry.date)}</td>
            <td>${entry.agentName}</td>
            <td>${entry.sales}</td>
            <td>${entry.remarks}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editEntry(${entry.id})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteEntry(${entry.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    updateSummary();
}

function editEntry(id) {
    const entries = JSON.parse(localStorage.getItem('salesEntries') || '[]');
    const entry = entries.find(e => e.id === id);
    
    if (entry) {
        document.getElementById('agentName').value = entry.agentName;
        document.getElementById('salesDate').value = entry.date;
        document.getElementById('salesCount').value = entry.sales;
        document.getElementById('remarks').value = entry.remarks;
        
        // Remove the old entry
        deleteEntry(id, false);
        
        // Scroll to form
        document.querySelector('.entry-form').scrollIntoView({ behavior: 'smooth' });
    }
}

function deleteEntry(id, confirm = true) {
    if (confirm && !window.confirm('Are you sure you want to delete this entry?')) {
        return;
    }
    
    let entries = JSON.parse(localStorage.getItem('salesEntries') || '[]');
    entries = entries.filter(e => e.id !== id);
    localStorage.setItem('salesEntries', JSON.stringify(entries));
    
    loadSalesEntries();
}

function filterSales() {
    const searchTerm = document.getElementById('searchAgent').value.toLowerCase();
    const filterDate = document.getElementById('filterDate').value;
    const rows = document.getElementById('salesTableBody').getElementsByTagName('tr');
    
    Array.from(rows).forEach(row => {
        const agentName = row.cells[1].textContent.toLowerCase();
        const date = row.cells[0].textContent;
        
        const matchesSearch = agentName.includes(searchTerm);
        const matchesDate = !filterDate || date === formatDate(filterDate);
        
        row.style.display = matchesSearch && matchesDate ? '' : 'none';
    });
}

function clearFilters() {
    document.getElementById('searchAgent').value = '';
    document.getElementById('filterDate').valueAsDate = new Date();
    filterSales();
}

function updateSummary() {
    const today = new Date().toISOString().split('T')[0];
    const entries = JSON.parse(localStorage.getItem('salesEntries') || '[]');
    
    // Filter today's entries
    const todayEntries = entries.filter(e => e.date === today);
    
    // Calculate total sales
    const totalSales = todayEntries.reduce((sum, entry) => sum + entry.sales, 0);
    
    // Find top agent
    const agentSales = {};
    todayEntries.forEach(entry => {
        agentSales[entry.agentName] = (agentSales[entry.agentName] || 0) + entry.sales;
    });
    
    let topAgent = '-';
    let maxSales = 0;
    Object.entries(agentSales).forEach(([agent, sales]) => {
        if (sales > maxSales) {
            maxSales = sales;
            topAgent = `${agent} (${sales})`;
        }
    });
    
    // Update summary
    document.getElementById('todayTotal').textContent = totalSales;
    document.getElementById('topAgent').textContent = topAgent;
    document.getElementById('activeAgents').textContent = Object.keys(agentSales).length;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}
