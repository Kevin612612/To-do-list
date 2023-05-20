// todoInput - text we tap to add
const todoInput = document.querySelector('.todo-input');
// todoButton - button we push to add todos
const todoButton = document.querySelector('.todo-button'); // plus button
// filterOption - filter to select completed/uncompleted todos
const filterOption = document.querySelector('.filter-todo');
// todoList - list of added todos
const todoList = document.querySelector('.todo-list'); //ul

const vercelAddress = 'https://to-do-list-orpin-theta.vercel.app'


// click button -> add todos

// click filter -> filter todos
filterOption.addEventListener('click', filterTodo);
// click delete -> delete todos
todoList.addEventListener('click', deleteCheck);
// page loaded -> upload todos from db
document.addEventListener('DOMContentLoaded', getTodosFromDb);
// page loaded -> upload todos from local storage
//document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener('click', addTodo)



// functions:

// addTodo()
// createToDo()
// deleteCheck()
// filterTodo()
// saveLocalTodos()
// saveTodosInDB()
// getTodos()
// getTodosFromDb()
// removeLocalTodos()
// removeDBTodos()
// markTodoDone()


async function addTodo(event) {
    // cansel of browser's actions default
    event.preventDefault();
    const text  = todoInput.value
    // create todoblock and put the text there
    createToDo(text)

    // save todos
    const todoObject = {
        name: todoInput.value.toString(),
        done: false,
        className: 'education'
    }
    // add todos in local storage
    saveLocalTodos(todoInput.value);
    // send text to server
    await saveTodosInDB(todoObject)
    // clean Input
    todoInput.value = '';
}

function createToDo(text) {
    // create div
    const todoDiv = document.createElement('div');
    // add class name
    todoDiv.classList.add('todo');

    // create li
    const newTodo = document.createElement('li');
    // add class name
    newTodo.classList.add('todo-item');
    // put the text into li
    newTodo.innerText = text;

    // create button 'is done'
    const completedButton = document.createElement('button');
    // add class name
    completedButton.classList.add('complete-btn');
    // put into button html text/image
    completedButton.innerHTML = '<i class="fas fa-check"></i>';

    // create button 'delete'
    const trashButton = document.createElement('button');
    // add class name
    trashButton.classList.add('trash-btn');
    // put into button html text/image
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';

    // put 'li' into 'div'
    todoDiv.appendChild(newTodo);
    // put the button 'is done' into div
    todoDiv.appendChild(completedButton);
    // put the button ''delete' into div
    todoDiv.appendChild(trashButton);
    // put todoDiv in 'ul'
    todoList.appendChild(todoDiv);
}


function deleteCheck(elem) {
    const item = elem.target;
    // delete todos
    if (item.classList[0] === 'trash-btn') {
        // div - parent
        const todo = item.parentElement;
        // animation
        todo.classList.add('fall');
        // delete from local storage
        removeLocalTodos(todo);
        // delete from DB
        removeDBTodos({ name: todo.firstChild.textContent})
        //
        todo.addEventListener("transitionend", function () {
            todo.remove();
        });
    }
    // check mark
    if (item.classList[0] === 'complete-btn') {
        // div - parent
        const todo = item.parentElement;
        // animation
        todo.classList.toggle('completed');
        // mark to_do is done in DB
        markTodoDone(todo.firstChild.textContent);
    }
}


function filterTodo(elem) {
    const todos = todoList.childNodes;

    todos.forEach(function (todo) {
        switch (elem.target.value) {
            case "all":
                todo.style.display = "flex";
                break;
            case 'completed':
                if (todo.classList.value.includes('completed')) {
                    todo.style.display = 'flex';
                } else {
                    todo.style.display = 'none';
                }
                break;
            case 'uncompleted':
                if (!todo.classList.value.includes('completed')) {
                    todo.style.display = 'flex';
                } else {
                    todo.style.display = 'none';
                }
                break;
        }
    });
}


function saveLocalTodos(todo) {
    // check if list already exist
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

async function saveTodosInDB(todoObject) {
    await fetch(`https://to-do-list-orpin-theta.vercel.app/todo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todoObject)
    })
}


function getTodos() {
    // check if list already exist
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    //create list of divs from array of todos
    todos.forEach(createToDo);
}


function getTodosFromDb() {
    fetch(`https://to-do-list-orpin-theta.vercel.app/todo`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => response.json())
        .then(data => data.map(x => x.name))
        .then(data => {
            data.forEach(createToDo);
        })
        .catch(error => console.error(error));
}

function removeLocalTodos(todo) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    const todoIndex = todo.children[0].innerText;
    todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}


function removeDBTodos(todoObject) {
    fetch(`https://to-do-list-orpin-theta.vercel.app/todo`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todoObject)
    })
}


// { name: todo.firstChild.textContent}
function markTodoDone(todo) {
    fetch(`https://to-do-list-orpin-theta.vercel.app/todo/done`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: todo })
    })
}
