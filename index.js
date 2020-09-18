let inputTask = document.getElementById('new-task');
let blockToggleAll = document.querySelector('div.chekbox__toggle-all');
let toggleAll = document.getElementById('toggle-all');
let taskList = document.getElementById('todo-list');
let blockFooter = document.querySelector('footer.footer');
let countLeft = document.getElementById('todo-count-left');
countLeft = 0;
let filterAll = document.getElementById('filter-all');
let filterActive = document.getElementById('filter-active');
let filterCompleted = document.getElementById('filter-completed');
let clearCompleted = document.getElementById('clear-completed');


// Создание элемента списка
function createNewElement (task) {
  let taskItem = document.createElement('li');
  let toggleOne = document.createElement('input');
  toggleOne.type = 'checkbox';
  toggleOne.className = 'toggle-one';
  let labelToggleOne = document.createElement('label');
  labelToggleOne.setAttribute('for', 'toggle-one');
  let label = document.createElement('label');
  label.innerText = task;
  let buttonDelete = document.createElement('button');
  buttonDelete.type = 'button';
  buttonDelete.className = 'delete';

  taskItem.appendChild(toggleOne);
  taskItem.appendChild(labelToggleOne);
  taskItem.appendChild(label);
  taskItem.appendChild(buttonDelete);

  return taskItem;
};

// Добавление новой задачи в список
function addTask() {
  if (inputTask.value) {
    let taskItem = createNewElement(inputTask.value);
    taskList.appendChild(taskItem);
    bindTaskEvents(taskItem);
    inputTask.value="";
    blockToggleAll.style.display = "block";
    blockFooter.style.display = "flex";
  };
};

inputTask.addEventListener('keyup', function (e) {
  if (e.keyCode === 13) {
    event.preventDefault();
    addTask();
  };
});

// удаление задачи
function deleteTask() {
  let taskItem = this.parentNode;
  let taskList = taskItem.parentNode;
  taskList.removeChild(taskItem);

  if (!taskList.hasChildNodes()) {
    blockToggleAll.style.display = "none";
    blockFooter.style.display = "none";
  };
};

// удаление всех завершенных задач
clearCompleted.onclick = function deleteCompletedTasks() {
  let taskItems = taskList.querySelectorAll('li');
  for(let i = 0; i < taskItems.length; i++) {
    if (taskItems[i].classList.contains('completed')) {
      taskItems[i].parentNode.removeChild(taskItems[i]);
    };
  };

  if (!taskList.hasChildNodes()) {
    blockToggleAll.style.display = "none";
    blockFooter.style.display = "none";
  };
};


function editTask() {

};

// завершение задачи через чекбокс
function toggleTask() {
  let taskItem = this.parentNode;
  let toggleOne = taskItem.querySelector('input.toggle-one');
  if (toggleOne.checked) {
    taskItem.classList.add('completed');
  } else {
    taskItem.classList.remove('completed');
  };

  //общий чек-лист загорается, если отмечены все задачи
  let taskItems = this.parentNode.parentNode.querySelectorAll('li');
  let countCompleted = 0;
  for(let i = 0; i < taskItems.length; i++) {
    if (taskItems[i].classList.contains('completed')) {
      countCompleted ++;
    };
  };
  if (countCompleted === taskItems.length) {
    toggleAll.checked = true;
  } else {
    toggleAll.checked = false;
  };
};

// завершение всех задач через чекбокс
toggleAll.onclick = function toggleAllTasks () {
  let taskItems = taskList.querySelectorAll('li');
  for(let taskItem of taskItems) {
    let toggleOne = taskItem.querySelector('input.toggle-one');
    if (toggleAll.checked) {
      taskItem.classList.add('completed');
      toggleOne.checked = true;
    } else {
      taskItem.classList.remove('completed');
      toggleOne.checked = false;
    };
  };
};

function bindTaskEvents(taskItem) {
  let checkbox = taskItem.querySelector('input.toggle-one');
  let deleteButton = taskItem.querySelector('button.delete');

  checkbox.onclick = toggleTask;
  deleteButton.onclick = deleteTask;
};


// фильтрация задач

//All
filterAll.onclick = function filterAllTasks () {
  let taskItems = taskList.querySelectorAll('li');
  for(let i = 0; i < taskItems.length; i++) {
    taskItems[i].style.display = "block";
  };
  filterActive.classList.remove('selected');
  filterAll.classList.add('selected');
  filterCompleted.classList.remove('selected');
};

//Active
filterActive.onclick = function filterActiveTasks () {
  let taskItems = taskList.querySelectorAll('li');
  for(let i = 0; i < taskItems.length; i++) {
    taskItems[i].style.display = "block";
    if (taskItems[i].classList.contains('completed')) {
      taskItems[i].style.display = "none";
    };
  };
  filterActive.classList.add('selected');
  filterAll.classList.remove('selected');
  filterCompleted.classList.remove('selected');
};

//Completed
filterCompleted.onclick = function filterCompletedTasks () {
  let taskItems = taskList.querySelectorAll('li');
  for(let i = 0; i < taskItems.length; i++) {
    taskItems[i].style.display = "block";
    if (!taskItems[i].classList.contains('completed')) {
      taskItems[i].style.display = "none";
    };
  };
  filterActive.classList.remove('selected');
  filterAll.classList.remove('selected');
  filterCompleted.classList.add('selected');
};