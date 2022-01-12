class Expense {
  constructor(year, month, day, type, description, value) {
    this.year = year;
    this.month = month;
    this.day = day;
    this.type = type;
    this.description = description;
    this.value = value;
  }

  validateData() {
    for (let i in this) {
      if (this[i] == undefined || this[i] == '' || this[i] == null) {
        return false
      }
    }
    return true
  }
}

class Db {

  constructor() {
    let id = localStorage.getItem('id');

    if (id === null) {
      localStorage.setItem('id', 0);
    }
  }

  getNextId() {
    let nextId = localStorage.getItem('id');

    return parseInt(nextId) + 1;
  }

  record(expen) {
    let id = this.getNextId();

    localStorage.setItem(id, JSON.stringify(expen));

    localStorage.setItem('id', id)
  }

  retrieveAllRegisters() {
    let id = localStorage.getItem('id');

    //array of expenses
    let expenses = [];

    //used to retrieve all expenses registered in localStorage
    for (let i = 1; i <= id; i++) {

      //retrieve an expense
      let expense = JSON.parse(localStorage.getItem(i));

      //check if there is a possibility that there are indexes that were removed

      if (expense === null) {
        continue;
      }
      expense.id = i
      expenses.push(expense);
    }

    return expenses;
  }

  pesquisar(expense) {

    let filterExpenses = [];

    filterExpenses = this.retrieveAllRegisters();

    //year
    if (expense.year != '') {
      filterExpenses = filterExpenses.filter(expen => expen.year == expense.year);
    };

    //month
    if (expense.month != '') {
      filterExpenses = filterExpenses.filter(expen => expen.month == expense.month);
    };

    //day
    if (expense.day != '') {
      filterExpenses = filterExpenses.filter(expen => expen.day == expense.day);
    };

    //type
    if (expense.type != '') {
      filterExpenses = filterExpenses.filter(expen => expen.type == expense.type);
    };

    //description
    if (expense.description != '') {
      filterExpenses = filterExpenses.filter(expen => expen.description == expense.description);
    };

    //value
    if (expense.value != '') {
      filterExpenses = filterExpenses.filter(expen => expen.value == expense.value);
    };

    return filterExpenses;
  }

  removeMethod(id){
    localStorage.removeItem(id)
  }

}

let db = new Db();

function registerExpense() {

  let year = document.getElementById('year')
  let month = document.getElementById('month')
  let day = document.getElementById('day')

  let type = document.getElementById('type')
  let description = document.getElementById('description')
  let value = document.getElementById('value')

  let expense = new Expense(
    year.value,
    month.value,
    day.value,
    type.value,
    description.value,
    value.value
  );

  if (expense.validateData()) {
    db.record(expense)

    document.getElementById('modal_title').innerHTML = 'Registro inserido com sucesso';
    document.getElementById('modal_title_div').className = "modal-header text-success";
    document.getElementById('modal_content').innerHTML = 'Despesa foi cadastrada com sucesso!';
    document.getElementById('modal_btn').innerHTML = 'Voltar';
    document.getElementById('modal_btn').className = "btn btn-success";
    $('#modalRegistraDespesa').modal('show');

    //reset form
    day.value = ''
    month.value = ''
    year.value = ''
    type.value = ''
    description.value = ''
    value.value = ''

  } else {
    document.getElementById('modal_title').innerHTML = 'Erro na inclusão do registro';
    document.getElementById('modal_title_div').className = "modal-header text-danger";
    document.getElementById('modal_content').innerHTML = 'Existem campos obrigatórios que não foram preenchidos';
    document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir';
    document.getElementById('modal_btn').className = "btn btn-danger";
    $('#modalRegisterExpense').modal('show')
  }

}

function loadExpenseList(expenses = [], filter = false) {

  if(expenses.length == 0 && filter == false){
    expenses = db.retrieveAllRegisters();
  }
  
  //selecting tbody element in table
  let expensesList = document.getElementById('list_expenses');
  expensesList.innerHTML = [];

  //looping through the expenses array, dynamically listing each expense
  expenses.forEach(expen => {
    //creating a row (tr)
    let row = expensesList.insertRow();

    //creating cols (td)
    row.insertCell(0).innerHTML = `${expen.day}/${expen.month}/${expen.year}`;
    //adjust the type
    switch (expen.type) {
      case '1': expen.type = 'Alimentação';
        break
      case '2': expen.type = 'Educação';
        break
      case '3': expen.type = 'Lazer';
        break
      case '4': expen.type = 'Saúde';
        break
      case '5': expen.type = 'Transporte';
        break
    }
    row.insertCell(1).innerHTML = expen.type;
    row.insertCell(2).innerHTML = expen.description;
    row.insertCell(3).innerHTML = expen.value;

    //delete button
    const deleteBtn = document.createElement('button');
    row.insertCell(4).append(deleteBtn);
    deleteBtn.className = 'btn btn-danger';
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>'
    deleteBtn.id = expen.id

    const tdDeleteBtn = deleteBtn.parentNode
    tdDeleteBtn.style.width = '2px'

    deleteBtn.onclick = function () {
      //remove an expense
      const response = confirm(`Deseja realmente excluir a despesa ${expen.description} do dia ${expen.day}/${expen.month}/${expen.year} da tipo ${expen.description} com valor de ${expen.value}?`);

      if (response) {
        let id = expen.id;
        db.removeMethod(id);

        window.location.reload()
      }
    }
  });
}

function searchExpense() {
  let year = document.getElementById('year').value;
  let month = document.getElementById('month').value;
  let day = document.getElementById('day').value;
  let type = document.getElementById('type').value;
  let description = document.getElementById('description').value;
  let value = document.getElementById('value').value;

  let expense = new Expense(year, month, day, type, description, value);

  var expenses = db.pesquisar(expense);

  loadExpenseList(expenses, true)
  sumExpenses(expenses)
}

function sumExpenses(expenses) {
  
  let sum = 0;
  for(let i in expenses){
    const expenseWithDot = parseFloat(expenses[i].value.replace(/,/, '.'))
    sum += expenseWithDot
  }
  
  const tfoot = document.getElementById('tfoot');
  tfoot.style.color = 'red'
  const trInTfoot = document.querySelectorAll('#trTfoot')

  //adding the result on tfoot
  const row = tfoot.insertRow();
  row.setAttribute('id', 'trTfoot')

  if(trInTfoot.length >= 0 ){
    row.insertCell(0).innerHTML = '';
    row.insertCell(1).innerHTML = '';
    row.insertCell(2).innerHTML = `Valor Total:`;
    row.insertCell(3).innerHTML = `R$${sum.toFixed(2)}`;
    trInTfoot[0].remove()
  }

}
