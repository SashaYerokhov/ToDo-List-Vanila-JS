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

// document.querySelector(".head__btn").addEventListener("click", switchTheme);
