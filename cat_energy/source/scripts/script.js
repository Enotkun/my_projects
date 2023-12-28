let navMenu = document.querySelector('.menu__popover');
let navToggle = document.querySelector('.menu__toggle');

navMenu.classList.remove('menu__popover--nojs');

navToggle.addEventListener('click', function () {
  if (navMenu.classList.contains('menu__popover--closed')) {
    navMenu.classList.remove('menu__popover--closed');
    navMenu.classList.add('menu__popover--opened');
  } else {
    navMenu.classList.add('menu__popover--closed');
    navMenu.classList.remove('menu__popover--opened');
  }
});


// Этот скрипт отвечает за функциональность выпадающего меню на веб - странице.

//   Переменная`navMenu` находит элемент с классом "menu__popover", который представляет собой выпадающее меню.
//     Переменная `navToggle` находит элемент с классом "menu__toggle", который представляет собой кнопку или иной элемент, при нажатии на которую открывается или закрывается выпадающее меню.

// С помощью метода `classList.remove('menu__popover--nojs')` удаляется класс "menu__popover--nojs" у выпадающего меню.Этот класс добавлен в HTML для предоставления базового стилевого оформления до загрузки скрипта.

// Затем добавляется обработчик события "click" на кнопку`navToggle`.Когда кнопка нажимается, выполняется функция, которая проверяет, содержит ли элемент `navMenu` класс "menu__popover--closed".Если он содержит этот класс, то класс "menu__popover--closed" удаляется и добавляется класс "menu__popover--opened" к элементу`navMenu`, иначе класс "menu__popover--closed" добавляется и удаляется класс "menu__popover--opened" у элемента`navMenu`.

// Таким образом, при каждом клике на кнопку `navToggle` выпадающее меню будет открываться, если оно закрыто, и наоборот.
