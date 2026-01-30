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

// получающий localstorage todo-list
let todos = JSON.parse(localStorage.getItem("todo-list"));

function showTodo() {
  let li = "";
  if (todos) {
    todos.forEach((todo, id) => {
      // console.log(id, todo);

      li += `
            <li id="${id}" draggable="true">
              <button class="btn__circle"></button>
               ${todo.name}
              <button class="btn__close">
                <img src="./images/icon-cross.svg" alt="icon cross" />
              </button>
            </li>
    `;
    });
  }

  todoBox.innerHTML = li;
}
showTodo();

function updateStatus(selectedTask) {
  let btnCircle = document.querySelectorAll(".btn__circle");
  // console.log(btnCircle);
  
  btnCircle.forEach((btnC) => {
    btnC.addEventListener("click", () => {
      btnC.classList.toggle("active");
      // console.log(btnC.parentElement);
      let selectedTask = btnC.parentElement;
      // console.log(selectedTask);
      
// let taskName = selectedTask
      if (btnC.classList.contains("active")) {
        // добавляем - класс - перечеркнутый текст
        btnC.parentElement.classList.add("strikeout");
         // меняем статус в ЛокалСторидж
        todos[selectedTask.id].status = 'completed';
      } else {
        btnC.parentElement.classList.remove("strikeout");
        todos[selectedTask.id].status = 'active';
      }
      localStorage.setItem("todo-list", JSON.stringify(todos));
    });
  });
}
updateStatus();

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

    showTodo();

    // Для отладки
    console.log("Задача добавлена:", taskInfo);
    console.log("Все задачи:", todos);
  }
});

/*****************************************************************/

// DRAG AND DROP - перетаскивание списка задач

// Переменная для всех задач
const tasks = document.querySelector("ul");
// console.log(tasks);

// Переменная для всех li списка
const liTasks = document.querySelectorAll("li");
liTasks.forEach((li) => {
  // при начале перетаскивания добавили класс -
  // то есть перетаскиваемый пункт - становится немного бледным
  li.addEventListener("dragstart", (event) => {
    event.target.classList.add("dragging");
  });
  // при конце перетаскивания - удалили класс
  li.addEventListener("dragend", (event) => {
    event.target.classList.remove("dragging");
  });
});

// console.log(liTasks);

// ручка для перетаскивания других элементов
tasks.addEventListener("dragover", (event) => {
  event.preventDefault();
  // console.log(event.target);
  const target = event.target.closest("li");
  const dragItem = document.querySelector(".dragging");

  if (target && target !== dragItem) {
    const { top, height } = target.getBoundingClientRect();

    //   Метод getBoundingClientRect() в JavaScript является частью API
    // объектной модели документа (DOM)
    //  и используется для получения размера и
    // положения элемента относительно области просмотра.
    // console.log(top, height); // показывает координаты

    const midPoint = top + height / 2;

    //   Свойство event.clientY содержит в себе расстояние от верхней
    // границы экрана до курсора во время события на JavaScript.
    if (event.clientY > midPoint) {
      target.after(dragItem);
    } else {
      target.before(dragItem);
    }
  }
});

tasks.addEventListener("drop", (event) => {
  event.preventDefault();
});

/**
 * атрибут draggable - это ключевой механизм, определяющий, можно ли элемент перетаскивать с помощью мыши или сенсорного экрана. Чтобы сделать элемент перетаскиваемым, необходимо установить draggable="true"
 * dragstart - запускается при начале перетаскивания (устанавливает данные)
 * dragover - Срабатывает, когда элемент перетаскивают над целью (требуется event.preventDefault(); для разрешения сброса)
 * drop - срабатывает, когда элемент бросают в цель
 */
