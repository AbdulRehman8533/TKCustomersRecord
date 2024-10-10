window.onload = function() {
    loadDataFromStorage();
};

// Save Data Function
function SaveData() {
    // Get input values
    const date = document.getElementById('date').value;
    const customerName = document.getElementById('CustomerName').value;
    const address = document.getElementById('Address').value;
    const orderNumber = document.getElementById('OrderNumber').value;
    const profit = document.getElementById('Profit').value;

    // Validate input
    if (!date || !customerName || !address || !orderNumber || !profit) {
        document.getElementById('error-message').innerText = 'All fields are required!';
        return;
    }

    // Clear error message
    document.getElementById('error-message').innerText = '';

    // Add new row to table
    const table = document.getElementById('TableData').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow(table.rows.length);
    newRow.insertCell(0).innerText = date;
    newRow.insertCell(1).innerText = customerName;
    newRow.insertCell(2).innerText = address;
    newRow.insertCell(3).innerText = orderNumber;
    newRow.insertCell(4).innerText = profit;

    // Add status dropdown
    const statusCell = newRow.insertCell(5);
    const statusSelect = document.createElement('select');
    statusSelect.className = 'status-select';
    statusSelect.innerHTML = `
        <option value="pending">Pending</option>
        <option value="payment-ok">Paid</option>
    `;
    statusSelect.value = 'pending';
    statusSelect.onchange = function() {
        updateStatusColor(this);
    };
    statusCell.appendChild(statusSelect);

    // Clear input fields
    document.getElementById('date').value = '';
    document.getElementById('CustomerName').value = '';
    document.getElementById('Address').value = '';
    document.getElementById('OrderNumber').value = '';
    document.getElementById('Profit').value = '';

    updateTotalProfit();
    saveDataToStorage();
}

// Update Status Color
function updateStatusColor(statusSelect) {
    const selectedValue = statusSelect.value;
    const row = statusSelect.parentElement.parentElement;

    if (selectedValue === 'pending') {
        row.style.backgroundColor = 'yellow';
    } else if (selectedValue === 'payment-ok') {
        row.style.backgroundColor = 'lightgreen';
    }
}
// Update total profit
function updateTotalProfit() {
    const table = document.getElementById('TableData').getElementsByTagName('tbody')[0];
    let total = 0;
    for (let i = 0; i < table.rows.length; i++) {
        total += parseFloat(table.rows[i].cells[4].innerText) || 0;
    }
    document.getElementById('TotalProfit').innerText = total;
}

// Show Paid Report
function showPaidReport() {
    showReport('payment-ok');
}

// Show Unpaid Report
function showUnpaidReport() {
    showReport('pending');
}

// Function to filter and show report by status
function showReport(status) {
    const table = document.getElementById('TableData').getElementsByTagName('tbody')[0];
    const newWindow = window.open('', '', 'width=600,height=400');
    newWindow.document.write('<h2>Report</h2><table border="1"><thead><tr><th>Date</th><th>Customer Name</th><th>Address</th><th>Tracking ID</th><th>Profit</th><th>Status</th></tr></thead><tbody>');

    let total = 0;
    for (let i = 0; i < table.rows.length; i++) {
        const row = table.rows[i];
        const rowStatus = row.querySelector('select').value;
        if (rowStatus === status) {
            const date = row.cells[0].innerText;
            const customerName = row.cells[1].innerText;
            const address = row.cells[2].innerText;
            const trackingId = row.cells[3].innerText;
            const profit = row.cells[4].innerText;
            total += parseFloat(profit) || 0;
            newWindow.document.write(`<tr><td>${date}</td><td>${customerName}</td><td>${address}</td><td>${trackingId}</td><td>${profit}</td><td>${rowStatus}</td></tr>`);
        }
    }
    newWindow.document.write('</tbody></table>');
    newWindow.document.write(`<p>Total: ${total}</p>`);
    newWindow.document.close();
}

// Save data to local storage
// Save data to localStorage
function saveDataToStorage() {
    const table = document.getElementById('TableData').getElementsByTagName('tbody')[0];
    const data = [];
    for (let i = 0; i < table.rows.length; i++) {
        const row = table.rows[i];
        const rowData = {
            date: row.cells[0].innerText,
            customerName: row.cells[1].innerText,
            address: row.cells[2].innerText,
            trackingId: row.cells[3].innerText,
            profit: row.cells[4].innerText,
            status: row.querySelector('select').value
        };
        data.push(rowData);
    }
    localStorage.setItem('customerRecords', JSON.stringify(data));
}

// Load data from local storage
// Load data from local storage
// Load data from local storage
// Load data from localStorage
function loadDataFromStorage() {
    const data = JSON.parse(localStorage.getItem('customerRecords')) || [];
    const table = document.getElementById('TableData').getElementsByTagName('tbody')[0];
    for (const rowData of data) {
        const newRow = table.insertRow(table.rows.length);
        newRow.insertCell(0).innerText = rowData.date;
        newRow.insertCell(1).innerText = rowData.customerName;
        newRow.insertCell(2).innerText = rowData.address;
        newRow.insertCell(3).innerText = rowData.trackingId;
        newRow.insertCell(4).innerText = rowData.profit;

        const statusCell = newRow.insertCell(5);
        const statusSelect = document.createElement('select');
        statusSelect.className = 'status-select';
        statusSelect.innerHTML = `
            <option value="pending">Pending</option>
            <option value="payment-ok">Paid</option>
        `;
        statusSelect.value = rowData.status;
        statusSelect.onchange = function() {
            updateStatusColor(this);
            saveDataToStorage();
        };
        statusCell.appendChild(statusSelect);

        updateStatusColor(statusSelect);
    }
    updateTotalProfit();
}

// Search function
document.getElementById('search-bar').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    const table = document.getElementById('TableData').getElementsByTagName('tbody')[0];
    const rows = table.getElementsByTagName('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const customerName = rows[i].cells[1].innerText.toLowerCase();
        const trackingId = rows[i].cells[3].innerText.toLowerCase();
        if (customerName.includes(searchValue) || trackingId.includes(searchValue)) {
            rows[i].style.display = ''; // Show row
        } else {
            rows[i].style.display = 'none'; // Hide row
        }
    }
});
