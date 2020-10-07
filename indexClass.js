const inputTask = document.getElementById('new-task');
const blockToggleAll = document.querySelector('div.chekbox__toggle-all');
const toggleAll = document.getElementById('toggle-all');
const taskList = document.getElementById('todo-list');
const blockFooter = document.querySelector('footer.footer');
const countLeft = document.getElementById('todo-count-left');
const filterAll = document.getElementById('filter-all');
const filterActive = document.getElementById('filter-active');
const filterCompleted = document.getElementById('filter-completed');
const clearCompleted = document.getElementById('clear-completed');
const keyEnter = 13;

let newId = 0;
let deleteButtons;

function countLeftNumber() {
  let count = 0;
  const taskItemsList = taskList.querySelectorAll('li');
  taskItemsList.forEach(item => {
    if (!item.classList.contains('completed')) {
      count++;
    };
  });
  countLeft.innerHTML = count;
};

class TodoList {

  constructor(task) {
    this.task = task;
  }

  toggleTask(task) {
    const checkbox = task.querySelector('input.toggle-one');
    checkbox.onclick = function () {
      const taskItem = this.parentNode;
      const taskItems = this.parentNode.parentNode.querySelectorAll('li');
      let countCompleted = 0;
      let countNotCompleted = 0;
      const toggleOne = taskItem.querySelector('input.toggle-one');
      const label = taskItem.querySelector('label.label-text');
      let classItem;
      const taskLocalStorage = [label.innerHTML];
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
      taskItems.forEach(item => {
        if (!item.classList.contains('completed')) {
          countNotCompleted ++;
        };
        if (item.classList.contains('completed')) {
          countCompleted ++;
        };
      });
      if (countNotCompleted === taskItems.length) {
        clearCompleted.style.display = "none";
      } else {
        clearCompleted.style.display = "block";
      };

      //общий чек-лист загорается, если отмечены все задачи
      if (countCompleted === taskItems.length) {
        toggleAll.checked = true;
      } else {
        toggleAll.checked = false;
      };
      countLeftNumber();
    }
  }

  deleteTask(task) {
    const deleteButton = task.querySelector('button.delete');
    deleteButton.onclick = function () {
      const taskItem = this.parentNode;
      const taskList = taskItem.parentNode;
      localStorage.removeItem("taskId_" + taskItem.getAttribute('data-item'));
      taskList.removeChild(taskItem);

      if (!taskList.hasChildNodes()) {
        blockToggleAll.style.display = "none";
        blockFooter.style.display = "none";
      };
      countLeftNumber();

      // убираем ClearCompleted, если нет завершенных задач
      const taskItems = taskList.querySelectorAll('li');
      let countNotCompleted = 0;
      taskItems.forEach(item => {
        if (!item.classList.contains('completed')) {
          countNotCompleted ++;
        };
      });
      if (countNotCompleted === taskItems.length) {
        clearCompleted.style.display = "none";
      } else {
        clearCompleted.style.display = "block";
      };
    };
  }

  editTask(task) {
    const editLabel = task.querySelector('label.label-text');
    editLabel.addEventListener('dblclick', function func() {

      const taskItem = this.parentNode;
      const input = taskItem.querySelector('input[type=text]');
      const toggleOne = taskItem.querySelector('input.toggle-one');
      const deleteButton = taskItem.querySelector('button.delete');
      const taskLocalStorage = [];
      let taskClass;
      taskItem.classList.add('editMode');
      input.value = editLabel.innerText;

      function editComplete(obj) {
        editLabel.innerText = obj.value;
        taskItem.classList.remove('editMode');
        taskLocalStorage[0] = obj.value;
        if (taskItem.classList.contains('completed')) {
          taskClass = 'completed';
        };
        taskLocalStorage[1] = taskClass;
        localStorage["taskId_" + taskItem.getAttribute('data-item')] = JSON.stringify(taskLocalStorage);
        editLabel.addEventListener('dblclick', func);
      };

      function editDelete() {
        const taskList = taskItem.parentNode;
        localStorage.removeItem("taskId_" + taskItem.getAttribute('data-item'));
        taskList.removeChild(taskItem);

        if (!taskList.hasChildNodes()) {
          blockToggleAll.style.display = "none";
          blockFooter.style.display = "none";
        };
        countLeftNumber();
        const taskItems = taskList.querySelectorAll('li');
        let countNotCompleted = 0;
        taskItems.forEach(item => {
          if (!item.classList.contains('completed')) {
            countNotCompleted ++;
          };
        });
        if (countNotCompleted === taskItems.length) {
          clearCompleted.style.display = "none";
        } else {
          clearCompleted.style.display = "block";
        };
      };

      input.addEventListener('blur', function() {
        editComplete(input);
        if (!input.value) {
          editDelete();
        };
  	  });

      input.addEventListener('keyup', function (e) {
        if (e.keyCode === keyEnter) {
          event.preventDefault();
          editComplete(input);
          if (!input.value) {
            editDelete();
          };
        };
  	  });

  	  editLabel.removeEventListener('dblclick', func);
    });

  }

  getValueAfterReload() {
    if (localStorage.length > 0) {
  		for (let i = 0; i < localStorage.length; i++) {
  		  let key = localStorage.key(i);
        let idTask = key.replace(/taskId_/gi, '');
        let taskObject = JSON.parse(localStorage.getItem(key));
        let valueTask = taskObject[0];
        let classTask = taskObject[1];
        let newTask = new Task(valueTask, idTask);
        let taskItem = newTask.createNewElement(valueTask, idTask);
        taskItem.classList.add(classTask);
        let toggleOne = taskItem.querySelector('input.toggle-one');
        if (classTask === 'completed') {
          toggleOne.checked = true;
        } else {
          toggleOne.checked = false;
        };
        taskList.appendChild(taskItem);
        this.toggleTask(taskItem);
        this.deleteTask(taskItem);
        this.editTask(taskItem);
  		};

      const taskItems = taskList.querySelectorAll('li');
      let countNotCompleted = 0;
      let countCompleted = 0;
      taskItems.forEach(item => {
        if (!item.classList.contains('completed')) {
          countNotCompleted ++;
        };
        if (item.classList.contains('completed')) {
          countCompleted ++;
        };
      });
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
  }

  addTask() {
    if (!inputTask.value) {
      return null;
    } else {
      let newTask = new Task(inputTask.value, newId);
      let taskItem = newTask.createNewElement(inputTask.value, newId);
      taskList.appendChild(taskItem);
      this.toggleTask(taskItem);
      this.deleteTask(taskItem);
      this.editTask(taskItem);
      const taskLocalStorage = [inputTask.value];
      localStorage.setItem('taskId_' + newId, JSON.stringify(taskLocalStorage));
      inputTask.value="";
      blockToggleAll.style.display = "block";
      blockFooter.style.display = "flex";
    };
  }

  toggleAllTasks() {
    const taskItems = taskList.querySelectorAll('li');
    let classItem;
    for(let taskItem of taskItems) {
      const toggleOne = taskItem.querySelector('input.toggle-one');
      const label = taskItem.querySelector('label.label-text');
      const taskLocalStorage = [label.innerHTML];
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

  deleteCompletedTasks() {
    const taskItems = taskList.querySelectorAll('li');
    taskItems.forEach(item => {
      if (item.classList.contains('completed')) {
        localStorage.removeItem("taskId_" + item.getAttribute('data-item'));
        item.parentNode.removeChild(item);
      };
    });

    if (!taskList.hasChildNodes()) {
      blockToggleAll.style.display = "none";
      blockFooter.style.display = "none";
    };
    countLeftNumber();
    clearCompleted.style.display = "none";
  }

  filterAllTasks() {
    const taskItems = taskList.querySelectorAll('li');
    taskItems.forEach(item => {
      item.style.display = "block";
    });
    filterActive.classList.remove('selected');
    filterAll.classList.add('selected');
    filterCompleted.classList.remove('selected');
  }

  filterActiveTasks() {
    const taskItems = taskList.querySelectorAll('li');
    taskItems.forEach(item => {
      item.style.display = "block";
      if (item.classList.contains('completed')) {
        item.style.display = "none";
      };
    });
    filterActive.classList.add('selected');
    filterAll.classList.remove('selected');
    filterCompleted.classList.remove('selected');
  }

  filterCompletedTasks() {
    const taskItems = taskList.querySelectorAll('li');
    taskItems.forEach(item => {
      item.style.display = "block";
      if (!item.classList.contains('completed')) {
        item.style.display = "none";
      };
    });
    filterActive.classList.remove('selected');
    filterAll.classList.remove('selected');
    filterCompleted.classList.add('selected');
  }
}

class Task {

  constructor(task, id) {
    this.task = task;
    this.id = id;
  }

  createNewElement(task, id) {
    const taskItem = document.createElement('li');
    taskItem.setAttribute('data-item', id);
    const toggleOne = document.createElement('input');
    toggleOne.type = 'checkbox';
    toggleOne.className = 'toggle-one';
    const labelToggleOne = document.createElement('label');
    labelToggleOne.setAttribute('for', 'toggle-one');
    const label = document.createElement('label');
    label.className = 'label-text';
    label.innerText = task;
    const input = document.createElement('input');
    input.type = 'text';
    const buttonDelete = document.createElement('button');
    buttonDelete.type = 'button';
    buttonDelete.className = 'delete';

    taskItem.appendChild(toggleOne);
    taskItem.appendChild(labelToggleOne);
    taskItem.appendChild(label);
    taskItem.appendChild(input);
    taskItem.appendChild(buttonDelete);

    return taskItem;
  }

}

const todoList = new TodoList;

todoList.getValueAfterReload();

inputTask.addEventListener('keyup', function (e) {
  if (e.keyCode === keyEnter) {
    event.preventDefault();
    const taskItems = taskList.querySelectorAll('li');
    taskItems.forEach(item => {
      let maxId = item.getAttribute('data-item');
      if (maxId > newId) {
        newId = maxId;
      };
    });
    newId++;
    todoList.addTask();
    // счётчик
    countLeftNumber();
    if (taskItems.length === 1) {
      toggleAll.checked = false;
    };
  };
});

toggleAll.onclick = todoList.toggleAllTasks;

clearCompleted.onclick = todoList.deleteCompletedTasks;

filterAll.onclick = todoList.filterAllTasks;

filterActive.onclick = todoList.filterActiveTasks;

filterCompleted.onclick = todoList.filterCompletedTasks;
