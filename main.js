const btnAdd = document.querySelector(".Todo_btn");
const inputValue = document.querySelector(".Todo__input");
const Tasks = document.querySelector(".Todo__list");

const TASKS_KEY = "todo-task";
const TASKS_COMPLETE_KEY = "todo-complete";

function getTasks() {
  const data = localStorage.getItem(TASKS_KEY);
  return data ? JSON.parse(data) : [];
}

function getCompleteTasks() {
  const data = localStorage.getItem(TASKS_COMPLETE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveTasks(tasksLocal) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasksLocal));
}

function saveTasksComplete(tasksLocal) {
  localStorage.setItem(TASKS_COMPLETE_KEY, JSON.stringify(tasksLocal));
}

// Создаёт DOM-элемент задачи
function createTaskElement(text) {
  const task = document.createElement("div");
  task.classList.add("Todo__item");

  const success = document.createElement("input");
  success.type = "checkbox";
  success.classList.add("Todo__item-checkbox");

  const nameTask = document.createElement("span");
  nameTask.classList.add("Todo__item-name");
  nameTask.textContent = text;

  const btnWrapper = document.createElement("div");
  btnWrapper.classList.add("btn-wrapper");

  const buttonDelete = document.createElement("button");
  buttonDelete.classList.add("Todo_btn--delete");
  buttonDelete.textContent = "Удалить";

  const buttonRename = document.createElement("button");
  buttonRename.classList.add("Todo_btn--rename");
  buttonRename.textContent = "Редактировать";

  btnWrapper.appendChild(buttonDelete);
  btnWrapper.appendChild(buttonRename);
  task.appendChild(success);
  task.appendChild(nameTask);
  task.appendChild(btnWrapper);

  return task;
}

function addTask() {
  const text = inputValue.value.trim();
  if (!text) return;

  const tasks = getTasks();
  if (tasks.includes(text)) return;

  tasks.push(text);
  saveTasks(tasks);

  const task = createTaskElement(text);
  Tasks.prepend(task);

  inputValue.value = "";
}

btnAdd.addEventListener("click", addTask);
inputValue.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

// Делегирование
Tasks.addEventListener("click", (e) => {
  if (e.target.classList.contains("Todo__item-checkbox")) {
    if (e.target.checked) {
      const taskItem = e.target.closest(".Todo__item");
      taskItem.style.opacity = 0.4;

      const tasks = getCompleteTasks();
      const text = taskItem.querySelector(".Todo__item-name").textContent;
      if (tasks.includes(text)) return;

      tasks.push(text);

      saveTasksComplete(tasks);
    } else {
      const taskItem = e.target.closest(".Todo__item");
      taskItem.style.opacity = 1;

      const tasks = getCompleteTasks();
      const text = taskItem.querySelector(".Todo__item-name").textContent;

      const filtered = tasks.filter((t) => t !== text);

      saveTasksComplete(filtered);
    }
  }

  if (e.target.classList.contains("Todo_btn--delete")) {
    const taskItem = e.target.closest(".Todo__item");
    const text = taskItem.querySelector(".Todo__item-name").textContent;
    const tasks = getTasks();
    const filtered = tasks.filter((t) => t !== text);
    saveTasks(filtered);
    taskItem.remove();
  }

  if (e.target.classList.contains("Todo_btn--rename")) {
    const taskItem = e.target.closest(".Todo__item");
    const titleName = taskItem.querySelector(".Todo__item-name");

    const oldText = titleName.textContent;

    const inputNewName = document.createElement("input");
    inputNewName.classList.add("Todo__input", "rename");
    inputNewName.value = oldText;
    taskItem.prepend(inputNewName);
    inputNewName.focus();

    titleName.textContent = "";

    inputNewName.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const newValue = inputNewName.value.trim();
        if (!newValue) {
          inputNewName.remove();
          titleName.textContent = oldText;
          return;
        }

        if (newValue === oldText) {
          inputNewName.remove();
          titleName.textContent = oldText;
          return;
        }

        const tasks = getTasks();
        const index = tasks.indexOf(oldText);

        if (index !== -1) {
          tasks[index] = newValue;
          saveTasks(tasks);
        }

        titleName.textContent = newValue;
        inputNewName.remove();
      }
    });

    inputNewName.addEventListener("blur", () => {
      if (inputNewName.parentNode === taskItem) {
        inputNewName.remove();
        if (!titleName.textContent.trim()) {
          titleName.textContent = oldText;
        }
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const tasks = getTasks();                    
  const completeTasks = getCompleteTasks();    

  tasks.forEach((taskText) => {
    const taskElement = createTaskElement(taskText);

    if (completeTasks.includes(taskText)) {
      taskElement.style.opacity = 0.4; 

      checkbox = taskElement.querySelector('.Todo__item-checkbox')
      checkbox.checked = true
    }


    Tasks.appendChild(taskElement);
  });
});