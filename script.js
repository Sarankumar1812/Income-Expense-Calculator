const entryForm = document.getElementById('entry-form');
const entryList = document.getElementById('entry-list');
const totalIncomeElement = document.getElementById('total-income');
const totalExpenseElement = document.getElementById('total-expense');
const netBalanceElement = document.getElementById('net-balance');
const filterOptions = document.querySelectorAll('input[name="filter"]');

let entries = JSON.parse(localStorage.getItem('entries')) || [];

function updateTotals() {
  const totalIncome = entries
    .filter(e => e.type === 'income')
    .reduce((acc, e) => acc + e.amount, 0);
  const totalExpense = entries
    .filter(e => e.type === 'expense')
    .reduce((acc, e) => acc + e.amount, 0);
  const netBalance = totalIncome - totalExpense;

  totalIncomeElement.textContent = `₹${totalIncome}`;
  totalExpenseElement.textContent = `₹${totalExpense}`;
  netBalanceElement.textContent = `₹${netBalance}`;
}

function displayEntries(filter = 'all') {
  entryList.innerHTML = '';

  const filteredEntries = entries.filter(entry => {
    if (filter === 'all') return true;
    return entry.type === filter;
  });

  filteredEntries.forEach((entry, index) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${capitalizeFirstLetter(entry.type)}</td>
      <td>${entry.date}</td>
      <td>${entry.description}</td>
      <td>₹${entry.amount}</td>
      <td>
        <img src="delete-icon.png" alt="Delete" class="delete-icon" onclick="deleteEntry(${index})">
      </td>
    `;

    entryList.appendChild(tr);
  });
}

function addEntry(description, amount, type, date) {
  entries.push({ description, amount: +amount, type, date });
  localStorage.setItem('entries', JSON.stringify(entries));
  updateTotals();
  displayEntries();
  toggleTableVisibility();
}

function deleteEntry(index) {
  entries.splice(index, 1);
  localStorage.setItem('entries', JSON.stringify(entries));
  updateTotals();
  displayEntries();
  toggleTableVisibility();
}

function toggleTableVisibility() {
  const entryTable = document.getElementById('entry-table');
  if (entries.length > 0) {
    entryTable.classList.remove('hidden');
  } else {
    entryTable.classList.add('hidden');
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

entryForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const type = document.getElementById('type').value;
  const date = document.getElementById('date').value;
  const description = document.getElementById('description').value.trim();
  const amount = document.getElementById('amount').value.trim();

  if (!type) {
    alert('Please select a type (Income or Expense)');
    return;
  }

  if (!date) {
    alert('Please select a date');
    return;
  }

  if (!description) {
    alert('Please enter a description');
    return;
  }

  if (!amount || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }

  addEntry(description, amount, type, date);
  entryForm.reset();
});

filterOptions.forEach(option => {
  option.addEventListener('change', (e) => {
    const filterValue = e.target.value;
    displayEntries(filterValue);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  updateTotals();
  displayEntries();
  toggleTableVisibility();
});
