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

// Этот класс не должен содержать логики, только методы управления
// Его контроллером выступает класс Todolist, он отвечает за всю логику, переключения и тд
class Task {
  constructor(id, title) {
    this.id = id;
    this.title = title;
    this.isHide = false;
    this.isComplete = false;
    this.onTaskDelete = () => {};
    this.onToggleClick = () => {};
    this.onTaskEdit = () => {};
    this.onTaskEditComplete = () => {};

    this.init = this.init.bind(this);
    this.delete = this.delete.bind(this);
    this.edit = this.edit.bind(this);
    this.editComplete = this.editComplete.bind(this);
    this.record = this.record.bind(this);
    this.reRecord = this.reRecord.bind(this);
    this.removeRecord = this.removeRecord.bind(this);
    this.completed = this.completed.bind(this);
    this.uncompleted = this.uncompleted.bind(this);
    this.init();
  }

  init() {
    this.root = document.createElement("li");
    this.input = document.createElement("input");
    this.label = document.createElement("label");
    this.toggleOne = document.createElement("input");
    this.buttonDelete = document.createElement("button");
    this.labelToggleOne = document.createElement("label");

    this.label.innerText = this.title;
    this.input.type = "text";
    this.toggleOne.type = "checkbox";
    this.buttonDelete.type = "button";
    this.label.className = "label-text";
    this.buttonDelete.className = "delete";
    this.toggleOne.className = "toggle-one";

    this.root.appendChild(this.toggleOne);
    this.root.appendChild(this.labelToggleOne);
    this.root.appendChild(this.label);
    this.root.appendChild(this.input);
    this.root.appendChild(this.buttonDelete);
    taskList.appendChild(this.root);

    this.toggleOne.addEventListener("click", () => this.onToggleClick(this));
    this.buttonDelete.addEventListener("click", () => this.onTaskDelete(this));
    this.label.addEventListener("dblclick", () => this.onTaskEdit(this));
    this.input.addEventListener("blur", () => this.onTaskEditComplete(this));
  }

  completed() {
    this.isComplete = true;
    this.root.classList.add("completed");
    this.toggleOne.checked = true;
  }

  uncompleted() {
    this.isComplete = false;
    this.root.classList.remove("completed");
    this.toggleOne.checked = false;
  }

  show() {
    this.isHide = false;
    this.root.style.display = "block";
  }

  hide() {
    this.isHide = true;
    this.root.style.display = "none";
  }

  delete() {
    this.root.remove();
  }

  edit() {
    this.root.classList.add("editMode");
    this.input.value = this.label.innerText;
  }

  editComplete() {
    this.root.classList.remove("editMode");
    this.label.innerText = this.input.value;
    this.title = this.input.value;
  }

  record() {
    let recordItem = {};
    recordItem['id'] = this.id;
    recordItem['title'] = this.title;
    recordItem['isComplete'] = this.isComplete;
    localStorage.setItem(this.id, JSON.stringify(recordItem));
  }

  reRecord() {
    let recordItem = {};
    recordItem['id'] = this.id;
    recordItem['title'] = this.title;
    recordItem['isComplete'] = this.isComplete;
    localStorage[this.id] = JSON.stringify(recordItem);
  }

  removeRecord() {
    localStorage.removeItem(this.id);
  }
}

class Todolist {
  constructor() {
    this.list = {};
    this.addTask = this.addTask.bind(this);
    this.recordTask = this.recordTask.bind(this);
    this.getList = this.getList.bind(this);
    this.toggleTask = this.toggleTask.bind(this);
    this.toggleAllTasks = this.toggleAllTasks.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.deleteCompletedTasks = this.deleteCompletedTasks.bind(this);
    this.editTask = this.editTask.bind(this);
    this.editCompleteTask = this.editCompleteTask.bind(this);
    this.showAllTasks = this.showAllTasks.bind(this);
    this.showAllCompletedTasks = this.showAllCompletedTasks.bind(this);
    this.showAllActiveTasks = this.showAllActiveTasks.bind(this);
    this.showFooter = this.showFooter.bind(this);
    this.showClearCompleted = this.showClearCompleted.bind(this);
    this.countLeftNumber = this.countLeftNumber.bind(this);
    this.control = this.control.bind(this);
    this.getValueAfterReload = this.getValueAfterReload.bind(this);

    this.control();
    this.getValueAfterReload();
  }

  control() {
    toggleAll.addEventListener("click", () => this.toggleAllTasks());
    clearCompleted.addEventListener("click", () => this.deleteCompletedTasks());
    filterActive.addEventListener("click", () => this.showAllActiveTasks());
    filterAll.addEventListener("click", () => this.showAllTasks());
    filterCompleted.addEventListener("click", () => this.showAllCompletedTasks());
  }

  getList() {
    return Object.values(this.list);
  }

  showFooter() {
    if (Object.keys(this.list).length === 0) {
      blockToggleAll.style.display = "none";
      blockFooter.style.display = "none";
    } else {
      blockToggleAll.style.display = "block";
      blockFooter.style.display = "flex";
    }
  }

  addTask(task) {
    this.list[task.id] = task;
    task.onTaskDelete = this.deleteTask;
    task.onToggleClick = this.toggleTask;
    task.onTaskEdit = this.editTask;
    task.onTaskEditComplete = this.editCompleteTask;
    this.showFooter();
    this.countLeftNumber();

  }

  recordTask(task) {
    task.record();
  }

  toggleTask(task) {
    if (task.isComplete) {
      task.uncompleted();
    } else {
      task.completed();
    }
    task.reRecord();
    this.countLeftNumber();
    this.showClearCompleted();
  }

  toggleAllTasks() {
    this.getList().forEach((task) => {
      if (toggleAll.checked) {
        task.completed();
      } else {
        task.uncompleted();
      }
      task.reRecord();
    });
    this.countLeftNumber();
    this.showClearCompleted();
  }

  showAllTasks() {
    this.getList().forEach((task) => {
      task.show();
      task.reRecord();
    });
    filterActive.classList.remove('selected');
    filterAll.classList.add('selected');
    filterCompleted.classList.remove('selected');
  }

  showAllCompletedTasks() {
    this.getList().forEach((task) => {
      if (task.isComplete) {
        task.show();
      } else {
        task.hide();
      }
      task.reRecord();
    });
    filterActive.classList.remove('selected');
    filterAll.classList.remove('selected');
    filterCompleted.classList.add('selected');
  }

  showAllActiveTasks() {
    this.getList().forEach((task) => {
      if (task.isComplete) {
        task.hide();
      } else {
        task.show();
      }
      task.reRecord();
    });
    filterActive.classList.add('selected');
    filterAll.classList.remove('selected');
    filterCompleted.classList.remove('selected');
  }

  deleteTask(task) {
    delete this.list[task.id];
    task.delete();
    task.removeRecord();
    this.countLeftNumber();
    this.showClearCompleted();
    this.showFooter();
  }

  deleteCompletedTasks() {
    this.getList().forEach((task) => {
      if (task.isComplete) {
        delete this.list[task.id];
        task.delete();
        task.removeRecord();
      }
    });
    this.countLeftNumber();
    this.showClearCompleted();
    this.showFooter();
  }

  editTask(task) {
    task.edit();
  }

  editCompleteTask(task) {
    if (!task.input.value) {
      delete this.list[task.id];
      task.delete();
      task.removeRecord();
      this.countLeftNumber();
      this.showClearCompleted();
      this.showFooter();
    } else {
      task.editComplete();
      task.reRecord();
    }
  }

  showClearCompleted() {
    let countNotCompleted = 0;
    this.getList().forEach((task) => {
      if (!task.isComplete) {
        countNotCompleted++;
      }
    });
    if (countNotCompleted === Object.keys(this.list).length) {
      clearCompleted.style.display = "none";
    } else {
      clearCompleted.style.display = "block";
    };
  }

  countLeftNumber() {
    let count = 0;
    this.getList().forEach((task) => {
      if (!task.isComplete) {
        count++;
      }
    });
    countLeft.innerHTML = count;
  }

  getValueAfterReload() {
    if (localStorage.length > 0) {
      for (let i = 0; i < localStorage.length; i++) {
        const id = localStorage.key(i);
        const taskObject = JSON.parse(localStorage.getItem(id));
        const title = taskObject['title'];
        const isComplete = taskObject['isComplete'];
        const task = new Task(id, title);
        this.addTask(task);
        if (isComplete) {
          task.completed();
        } else {
          task.uncompleted();
        }
      }
      this.countLeftNumber();
      this.showClearCompleted();
      this.showFooter();
    }
  }

}

// Инициализация списка
const todoList = new Todolist();

// подписка на инпут ввода тасков
inputTask.addEventListener("keyup", function (e) {
  if (e.keyCode === keyEnter) {

    const id = new Date().getTime();
    const title = e.target.value;
    if (!e.target.value) {
      return null
    } else {
      const task = new Task(id, title);

      todoList.addTask(task);
      todoList.recordTask(task);
      e.target.value = "";
    }
  }
});
