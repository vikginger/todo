let inputTask = document.getElementById('new-task');
let blockToggleAll = document.querySelector('div.chekbox__toggle-all');
let toggleAll = document.getElementById('toggle-all');
let taskList = document.getElementById('todo-list');
let blockFooter = document.querySelector('footer.footer');
let countLeft = document.getElementById('todo-count-left');
let filterAll = document.getElementById('filter-all');
let filterActive = document.getElementById('filter-active');
let filterCompleted = document.getElementById('filter-completed');
let clearCompleted = document.getElementById('clear-completed');

let newId = 0;

// счётчик
function countLeftNumber() {
  let count = 0;
  let taskItemsList = taskList.querySelectorAll('li');
  for(let i = 0; i < taskItemsList.length; i++) {
    if (!taskItemsList[i].classList.contains('completed')) {
      count++;
    };
  };
  countLeft.innerHTML = count;
};

// добавление задач из LocalStorage при загрузке
function getValueAfterReload() {
  if (localStorage.length > 0) {
		for (i = 0; i < localStorage.length; i++) {
		  let key = localStorage.key(i);
      let idTask = key.replace(/taskId_/gi, '');
      let taskObject = JSON.parse(localStorage.getItem(key));
      let valueTask = taskObject[0];
      let classTask = taskObject[1];
      let taskItem = createNewElement(valueTask, idTask);
      taskItem.classList.add(classTask);
      let toggleOne = taskItem.querySelector('input.toggle-one');
      if (classTask === 'completed') {
        toggleOne.checked = true;
      } else {
        toggleOne.checked = false;
      };
      taskList.appendChild(taskItem);
      bindTaskEvents(taskItem);
		};

    let taskItems = taskList.querySelectorAll('li');
    let countNotCompleted = 0;
    let countCompleted = 0;
    for(let i = 0; i < taskItems.length; i++) {
      if (!taskItems[i].classList.contains('completed')) {
        countNotCompleted ++;
      };
      if (taskItems[i].classList.contains('completed')) {
        countCompleted ++;
      };
    };
    if (countNotCompleted === taskItems.length) {
      clearCompleted.style.display = "none";
    } else {
      clearCompleted.style.display = "block";
    };
    if (countCompleted === taskItems.length) {
      toggleAll.checked = true;
    } else {
      toggleAll.checked = false;
    };
    blockToggleAll.style.display = "block";
    blockFooter.style.display = "flex";

    countLeftNumber();
	};
};

getValueAfterReload();

// Создание элемента списка
function createNewElement (task, id) {
  let taskItem = document.createElement('li');
  taskItem.setAttribute('data-item', id);
  let toggleOne = document.createElement('input');
  toggleOne.type = 'checkbox';
  toggleOne.className = 'toggle-one';
  let labelToggleOne = document.createElement('label');
  labelToggleOne.setAttribute('for', 'toggle-one');
  let label = document.createElement('label');
  label.className = 'label-text';
  label.innerText = task;
  let input = document.createElement('input');
  input.type = 'text';
  let buttonDelete = document.createElement('button');
  buttonDelete.type = 'button';
  buttonDelete.className = 'delete';

  taskItem.appendChild(toggleOne);
  taskItem.appendChild(labelToggleOne);
  taskItem.appendChild(label);
  taskItem.appendChild(input);
  taskItem.appendChild(buttonDelete);

  return taskItem;
};

// Добавление новой задачи в список
function addTask() {
  if (inputTask.value) {
    let taskItem = createNewElement(inputTask.value, newId);
    taskList.appendChild(taskItem);
    bindTaskEvents(taskItem);
    let taskLocalStorage = [inputTask.value];
    localStorage.setItem('taskId_' + newId, JSON.stringify(taskLocalStorage));
    inputTask.value="";
    blockToggleAll.style.display = "block";
    blockFooter.style.display = "flex";
  };
};

inputTask.addEventListener('keyup', function (e) {
  if (e.keyCode === 13) {
    event.preventDefault();
    let taskItems = taskList.querySelectorAll('li');
    for(let i = 0; i < taskItems.length; i++) {
      let maxId = taskItems[i].getAttribute('data-item');
      if (maxId > newId) {
        newId = maxId;
      };
    };
    newId++;
    addTask();
    // счётчик
    countLeftNumber();

    if (taskItems.length === 1) {
      toggleAll.checked = false;
    };
  };
});

// удаление задачи
function deleteTask() {
  let taskItem = this.parentNode;
  let taskList = taskItem.parentNode;
  localStorage.removeItem("taskId_" + taskItem.getAttribute('data-item'));
  taskList.removeChild(taskItem);

  if (!taskList.hasChildNodes()) {
    blockToggleAll.style.display = "none";
    blockFooter.style.display = "none";
  };
  countLeftNumber();

  // убираем ClearCompleted, если нет завершенных задач
  let taskItems = taskList.querySelectorAll('li');
  let countNotCompleted = 0;
  for(let i = 0; i < taskItems.length; i++) {
    if (!taskItems[i].classList.contains('completed')) {
      countNotCompleted ++;
    };
  };
  if (countNotCompleted === taskItems.length) {
    clearCompleted.style.display = "none";
  } else {
    clearCompleted.style.display = "block";
  };
};

// удаление всех завершенных задач
clearCompleted.onclick = function deleteCompletedTasks() {
  let taskItems = taskList.querySelectorAll('li');
  for(let i = 0; i < taskItems.length; i++) {
    if (taskItems[i].classList.contains('completed')) {
      localStorage.removeItem("taskId_" + taskItems[i].getAttribute('data-item'));
      taskItems[i].parentNode.removeChild(taskItems[i]);
    };
  };

  if (!taskList.hasChildNodes()) {
    blockToggleAll.style.display = "none";
    blockFooter.style.display = "none";
  };
  countLeftNumber();
  clearCompleted.style.display = "none";
};

// завершение задачи через чекбокс
function toggleTask() {
  let taskItem = this.parentNode;
  let taskItems = this.parentNode.parentNode.querySelectorAll('li');
  let countCompleted = 0;
  let countNotCompleted = 0;
  let toggleOne = taskItem.querySelector('input.toggle-one');
  let label = taskItem.querySelector('label.label-text');
  let classItem;
  let taskLocalStorage = [label.innerHTML];
  if (toggleOne.checked) {
    taskItem.classList.add('completed');
    classItem = 'completed';
    taskLocalStorage[1] = classItem;
  } else {
    taskItem.classList.remove('completed');
    taskLocalStorage[1] = classItem;
  };

  // перезаписываем значение в LocalStorage вместе с классом
  localStorage["taskId_" + taskItem.getAttribute('data-item')] = JSON.stringify(taskLocalStorage);

  //добавление Clear Completed
  for(let i = 0; i < taskItems.length; i++) {
    if (!taskItems[i].classList.contains('completed')) {
      countNotCompleted ++;
    };
  };
  if (countNotCompleted === taskItems.length) {
    clearCompleted.style.display = "none";
  } else {
    clearCompleted.style.display = "block";
  };

  //общий чек-лист загорается, если отмечены все задачи
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

  countLeftNumber();
};

// завершение всех задач через чекбокс
toggleAll.onclick = function toggleAllTasks () {
  let taskItems = taskList.querySelectorAll('li');
  let classItem;
  for(let taskItem of taskItems) {
    let toggleOne = taskItem.querySelector('input.toggle-one');
    let label = taskItem.querySelector('label.label-text');
    let taskLocalStorage = [label.innerHTML];
    if (toggleAll.checked) {
      taskItem.classList.add('completed');
      toggleOne.checked = true;
      classItem = 'completed';
      taskLocalStorage[1] = classItem;
      clearCompleted.style.display = "block";
    } else {
      taskItem.classList.remove('completed');
      toggleOne.checked = false;
      taskLocalStorage[1] = classItem;
      clearCompleted.style.display = "none";
    };
    localStorage["taskId_" + taskItem.getAttribute('data-item')] = JSON.stringify(taskLocalStorage);
  };

  countLeftNumber();
};

function bindTaskEvents(taskItem) {
  let checkbox = taskItem.querySelector('input.toggle-one');
  let deleteButton = taskItem.querySelector('button.delete');
  let editLabel = taskItem.querySelector('label.label-text');

  checkbox.onclick = toggleTask;
  deleteButton.onclick = deleteTask;

  // редактирование задачи
  editLabel.addEventListener('dblclick', function func() {

    let taskItem = this.parentNode;

    let input = taskItem.querySelector('input[type=text]');
    let toggleOne = taskItem.querySelector('input.toggle-one');
    let deleteButton = taskItem.querySelector('button.delete');
    let taskLocalStorage = [];
    let taskClass;
    taskItem.classList.add('editMode');
    input.value = editLabel.innerText;

    input.addEventListener('blur', function() {
		  editLabel.innerText = this.value;
      taskItem.classList.remove('editMode');
      taskLocalStorage[0] = this.value;
      if (taskItem.classList.contains('completed')) {
        taskClass = 'completed';
      }
      taskLocalStorage[1] = taskClass;
      localStorage["taskId_" + taskItem.getAttribute('data-item')] = JSON.stringify(taskLocalStorage);
      editLabel.addEventListener('dblclick', func);
	  });

	  editLabel.removeEventListener('dblclick', func);
  });
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
