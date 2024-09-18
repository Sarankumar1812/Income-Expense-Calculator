const entryForm = document.getElementById('entry-form');
const entryList = document.getElementById('entry-list');
const totalIncomeElement = document.getElementById('total-income');
const totalExpenseElement = document.getElementById('total-expense');
const netBalanceElement = document.getElementById('net-balance');
const filterOptions = document.querySelectorAll('input[name="filter"]');

let entries = JSON.parse(localStorage.getItem('entries')) || [];
let editIndex = null;


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

  const filteredEntries = entries.filter(entry => 
    filter === 'all' || entry.type === filter
  );

  filteredEntries.forEach((entry, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${entry.type}</td>
      <td>${entry.date}</td>
      <td>${entry.description}</td>
      <td>₹${entry.amount}</td>
      <td class="edt">
        <img src="edit-icon.png" class="edit-icon" alt="Edit" onclick="editEntry(${index})">
        <img src="delete-icon.png" class="delete-icon" alt="Delete" onclick="deleteEntry(${index})">
      </td>
    `;
    
    entryList.appendChild(row);
  });
}


function addOrEditEntry(event) {
  event.preventDefault();

  const type = document.getElementById('type').value;
  const date = document.getElementById('date').value;
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);

  if (editIndex === null) {
   
    entries.push({ type, date, description, amount });
  } else {
   
    entries[editIndex] = { type, date, description, amount };
    editIndex = null;
  }

  localStorage.setItem('entries', JSON.stringify(entries));
  entryForm.reset();
  displayEntries();
  updateTotals();
}


function editEntry(index) {
  const entry = entries[index];
  document.getElementById('type').value = entry.type;
  document.getElementById('date').value = entry.date;
  document.getElementById('description').value = entry.description;
  document.getElementById('amount').value = entry.amount;
  editIndex = index;
}


function deleteEntry(index) {
  entries.splice(index, 1);
  localStorage.setItem('entries', JSON.stringify(entries));
  displayEntries();
  updateTotals();
}


entryForm.addEventListener('submit', addOrEditEntry);


filterOptions.forEach(option => {
  option.addEventListener('change', (e) => {
    displayEntries(e.target.value);
  });
});


displayEntries();
updateTotals();
