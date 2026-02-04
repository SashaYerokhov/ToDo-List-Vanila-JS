// Переключение светлая/темная тема

// Функция для переключения тем со светлой на темную
const switchTheme = () => {
  // создание корневого элемента в HTML-тег
  const rootElem = document.documentElement;
  // получаем значение аттрибута в HTML-теге
  let colorTheme = rootElem.getAttribute("color-scheme"),
    // Опеределение новой переменной
    newTheme;

  // использование тернарного оператора if
  newTheme = colorTheme === "light" ? "dark" : "light";

  rootElem.setAttribute("color-scheme", newTheme);

  // устанавливаем новый аттрибут
  localStorage.setItem("theme", newTheme);
};

// смена картинки солнце - луна
const sun = document.querySelector(".sun");
const moon = document.querySelector(".moon");
// console.log(sun, moon);

const bgLight = document.querySelector(".light");
const bgDark = document.querySelector(".dark");
// console.log(bgLight, bgDark);

moon.addEventListener("click", () => {
  moon.classList.add("active");
  sun.classList.add("active");
  bgLight.classList.add("active");
  bgDark.classList.add("active");
  switchTheme();
});
sun.addEventListener("click", () => {
  moon.classList.remove("active");
  sun.classList.remove("active");
  bgLight.classList.remove("active");
  bgDark.classList.remove("active");
  switchTheme();
});

/**************************************************************/

const inputTask = document.querySelector(".head__input input");
// console.log(inputTask);
const todoBox = document.querySelector(".todo__box");
// console.log(todoBox);

const filtersBtn = document.querySelectorAll(".todo__list-buttons-down button");
// console.log(filtersBtn);

const btnClearCompleted = document.querySelector(".btn__completed");
// console.log(btnClearCompleted);

// получающий localstorage todo-list
let todos = JSON.parse(localStorage.getItem("todo-list"));
// отдельное свойство для хранения завершённых задач:
let completedTodos = JSON.parse(localStorage.getItem("completed-list")) || [];
//
let currentFilter = "all";

// фильтрация задач
filtersBtn.forEach((filterBtn) => {
  filterBtn.addEventListener("click", () => {
    // console.log(filterBtn);
    document.querySelector("button.color").classList.remove("color");
    filterBtn.classList.add("color");
    currentFilter = filterBtn.id;
    showTodo(currentFilter);
    // console.log(filterBtn.id);
  });
});

function showTodo(filter) {
  let li = "";
  if (todos && todos.length > 0) {
    todos.forEach((todo, id) => {
      // console.log(id, todo);
      let isCompleted = todo.status == "completed" ? "strikeout" : "";
      // Правильная логика фильтрации
      let showTask = false;
      if (filter === "all") {
        showTask = true;
      } else if (filter === "active") {
        showTask = todo.status !== "completed";
      } else if (filter === "completed") {
        showTask = todo.status === "completed";
      }
      if (showTask) {
        li += `
            <li data-id="${id}" class="todo-item ${isCompleted}" draggable="true">
              <button class="btn__circle ${todo.status === "completed" ? "active" : ""}"></button>
              ${todo.name}
              <button class="btn__close">
                <img src="./images/icon-cross.svg" alt="icon cross" />
              </button>
            </li>
    `;
      }
    });
  }
  todoBox.innerHTML = li || `<span>You don't have any task here</span>`;
  // После рендеринга добавляем обработчики
  addEventListeners();
  updateCounter(); // ← Добавьте здесь
}
showTodo(currentFilter);

function addEventListeners() {
  // Обработчики для кнопок кружков
  document.querySelectorAll(".btn__circle").forEach((btn) => {
    btn.addEventListener("click", function () {
      // console.log(btn); // при клике на круг - HTML-тег кнопки круга

      const todoItem = this.closest(".todo-item");
      // console.log(todoItem); // при клике на круг - обращение к родителю тегу - li
      const id = parseInt(todoItem.dataset.id);
      // console.log(id); // У li есть data-атрибут - data-id - при клике на круг - номер id
      // при клике на круг - меняется круг - и текст зачеркивается
      this.classList.toggle("active");
      todoItem.classList.toggle("strikeout");

      // Обновляем статус задачи
      if (this.classList.contains("active")) {
        todos[id].status = "completed";
      } else {
        todos[id].status = "pending"; // или "active", в зависимости от логики
      }

      localStorage.setItem("todo-list", JSON.stringify(todos));
      updateCounter(); // ← Добавьте здесь
      // Если фильтр не "all", скрываем задачу
      if (currentFilter !== "all") {
        showTodo(currentFilter);
      }
    });
  });

  // Обработчики для кнопок удаления
  document.querySelectorAll(".btn__close").forEach((btn) => {
    btn.addEventListener("click", function () {
      const todoItem = this.closest(".todo-item");
      const id = parseInt(todoItem.dataset.id);

      // Выражение todos.splice(id, 1) удаляет один элемент из массива todos
      // начиная с позиции (индекса), указанной в переменной id
      todos.splice(id, 1);
      // обновления в localStorage
      localStorage.setItem("todo-list", JSON.stringify(todos));
      showTodo(currentFilter);
      updateCounter(); // ← Добавлено в showTodo
    });
  });
}

function countActiveTasks() {
  if (!todos || todos.length === 0) return 0;

  // Считаем задачи со статусом не "completed"
  const activeCount = todos.filter(
    (todo) => todo.status !== "completed",
  ).length;
  return activeCount;
}

// Обновляем счетчик при любых изменениях
function updateCounter() {
  const counterElement = document.querySelector(".todo__counter");
  if (counterElement) {
    const count = countActiveTasks();
    counterElement.textContent = `${count} items left`;
  }
}

// Кнопка удалить все выполненные задачи
function clearCompletedTasks() {
  if (!todos || todos.length === 0) return;
  // Фильтруем только НЕ выполненные задачи
  todos = todos.filter((todo) => todo.status !== "completed");

  // Сохраняем в localStorage
  localStorage.setItem("todo-list", JSON.stringify(todos));
  // Обновляем отображение
  // showTodo(currentFilter);
  updateCounter();
}

// 3. Добавьте обработчик события
btnClearCompleted.addEventListener("click", clearCompletedTasks);

// При вводет текста и нажатии на клавишу Enter
inputTask.addEventListener("keyup", (event) => {
  let userTask = inputTask.value.trim();
  if (event.key === "Enter" && userTask) {
    // console.log(userTask); // в консоль ввыдодится то что ввели в поле и нажали на клавишу Enter

    if (!todos) {
      // Если todos не существует, передайте пустой массив в функцию todos.
      todos = [];
    }
    // Очищаем поле ввода
    inputTask.value = "";
    // создаем объект для новой задачи
    let taskInfo = { name: userTask, status: "active" };
    todos.push(taskInfo); //
    localStorage.setItem("todo-list", JSON.stringify(todos));

    showTodo(currentFilter);
    updateCounter(); // ← Можно и здесь для надежности

    // Для отладки
    console.log("Задача добавлена:", taskInfo);
    console.log("Все задачи:", todos);
  }
});

// Обработчики для перетаскивания (если нужно)
todoBox.addEventListener("dragstart", (e) => {
  if (e.target.classList.contains("todo-item")) {
    e.dataTransfer.setData("text/plain", e.target.dataset.id);
  }
});
todoBox.addEventListener("dragover", (e) => {
  e.preventDefault();
});

todoBox.addEventListener("drop", (e) => {
  e.preventDefault();
  const draggedId = e.dataTransfer.getData("text/plain");
  const target = e.target.closest(".todo-item");

  if (target && draggedId !== target.dataset.id) {
    // Реализуйте логику перестановки задач
    const fromIndex = parseInt(draggedId);
    const toIndex = parseInt(target.dataset.id);

    // Перемещаем элемент в массиве
    const [movedItem] = todos.splice(fromIndex, 1);
    todos.splice(toIndex, 0, movedItem);

    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(currentFilter);
  }
});
