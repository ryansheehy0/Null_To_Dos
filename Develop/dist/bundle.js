/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./component_classes/board.js":
/*!************************************!*\
  !*** ./component_classes/board.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Board)\n/* harmony export */ });\n/* harmony import */ var _utils_elementFromHTML__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/elementFromHTML */ \"./utils/elementFromHTML.js\");\n/* harmony import */ var _item_item_children_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./item/item_children/list */ \"./component_classes/item/item_children/list.js\");\n\n\n\nfunction Board(){\n  // Get variables\n  let element = (0,_utils_elementFromHTML__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(`\n    <div data-name=\"board\" class=\"w-screen h-screen grid grid-flow-col overflow-x-auto justify-start\">\n      <div data-name=\"add-list-btn\" class=\"cursor-pointer flex items-center justify-center custom-text-color custom-2nd-color w-64 min-h-8 py-1.5 px-3 mx-1 my-2 rounded-xl h-fit box-content\" draggable=\"false\">\n        <img src=\"./assets/plus.svg\" class=\"custom-img-color w-8 h-8\" draggable=\"false\">\n        Add another list\n      </div>\n    </div>\n  `)\n\n  const addListBtn = element.querySelector(`[data-name=\"add-list-btn\"]`)\n\n  // Helper factions\n  newList = () => {\n    const list = new _item_item_children_list__WEBPACK_IMPORTED_MODULE_1__[\"default\"](this)\n    this.addList(list)\n    list.focus()\n  }\n\n  // Event listeners\n  addListBtn.addEventListener(\"click\", () => {\n    newList()\n  })\n\n  // Enter key with nothing focused creates new list\n  document.addEventListener(\"keydown\", (event) => {\n    if(document.activeElement !== document.body) return // Exit if something else is in focus\n    if(event.key === \"Enter\"){\n      event.preventDefault() // Prevent new lines in newly created lists\n      newList()\n    }\n  })\n\n  // Methods\n  this.getElement = function(){return element}\n\n  this.addList = function(list){\n    // Put list inside board\n    addListBtn.insertAdjacentElement(`beforebegin` /*Above*/, list.getElement())\n  }\n\n  this.load = function(){\n    // Remove existing board\n    const existingBoard = document.querySelector(`[data-name=\"board\"]`)\n    if(existingBoard) existingBoard.remove()\n    // Get the navbar\n    const navbar = document.querySelector(`#navbar`)\n    // Add this board\n    navbar.insertAdjacentElement(`afterend` /*After Element*/, element)\n  }\n}\n\n//# sourceURL=webpack://develop/./component_classes/board.js?");

/***/ }),

/***/ "./component_classes/item/item.js":
/*!****************************************!*\
  !*** ./component_classes/item/item.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Item)\n/* harmony export */ });\n/* harmony import */ var _utils_elementFromHTML__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/elementFromHTML */ \"./utils/elementFromHTML.js\");\n/* harmony import */ var _item_subclasses_event__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./item_subclasses/event */ \"./component_classes/item/item_subclasses/event.js\");\n\n\n\nfunction Item(parentItem){\n  // Variables\n    let element = (0,_utils_elementFromHTML__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(`\n      <div data-name=\"\" class=\"custom-text-color rounded-xl py-1.5 px-3 min-w-[16rem] w-min grid grid-cols-[auto_auto] min-h-8 h-fit my-2 box-content\" draggable=\"true\">\n        <textarea class=\"m-0 flex items-center border-none bg-transparent custom-text-color text-base h-auto resize-none mt-auto mb-auto pl-1 focus:rounded focus:outline focus:outline-1 focus:custom-text-outline\" oninput='\n          this.style.height = \"fit-content\";\n          this.style.height = this.scrollHeight + \"px\";\n          if(this.value.length > 255){\n            this.value = this.value.substr(0, 255)\n          }' rows=\"1\" spellcheck=\"false\" draggable=\"false\"></textarea>\n        <div data-name=\"buttons\" class=\"flex items-center justify-end\" draggable=\"false\">\n          <img src=\"./assets/plus.svg\" class=\"custom-img-color w-8 h-8\" draggable=\"false\">\n          <img src=\"./assets/trash.svg\" class=\"custom-img-color w-5 h-5\" draggable=\"false\">\n        </div>\n      </div>\n    `)\n    this.element = element // Pass to children\n\n    let plus = element.querySelector(`img[src*=\"plus\"]`)\n    let trash = element.querySelector(`img[src*=\"trash\"]`)\n    let textarea = element.querySelector(`textarea`)\n\n  // Set the event listeners\n    new _item_subclasses_event__WEBPACK_IMPORTED_MODULE_1__[\"default\"](this, plus, trash, textarea, element, parentItem)\n\n  // Methods\n    this.getElement = function(){return element}\n\n    this.addCard = function(card){\n      // Insert card at the end of the list\n      element.insertAdjacentElement(`beforeend` /*Last Child*/, card.getElement())\n    }\n\n    this.focus = function(){\n      textarea.focus()\n    }\n}\n\n//# sourceURL=webpack://develop/./component_classes/item/item.js?");

/***/ }),

/***/ "./component_classes/item/item_children/card.js":
/*!******************************************************!*\
  !*** ./component_classes/item/item_children/card.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Card)\n/* harmony export */ });\n/* harmony import */ var _item__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../item */ \"./component_classes/item/item.js\");\n\n\nfunction Card(parentItem){\n  _item__WEBPACK_IMPORTED_MODULE_0__[\"default\"].call(this, parentItem)\n  this.element.classList.add(\"custom-3rd-color\", \"col-span-2\", \"custom-2nd-border\")\n  this.element.dataset.name = \"card\"\n}\n\n//# sourceURL=webpack://develop/./component_classes/item/item_children/card.js?");

/***/ }),

/***/ "./component_classes/item/item_children/list.js":
/*!******************************************************!*\
  !*** ./component_classes/item/item_children/list.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ List)\n/* harmony export */ });\n/* harmony import */ var _item__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../item */ \"./component_classes/item/item.js\");\n\n\nfunction List(parentItem){\n  _item__WEBPACK_IMPORTED_MODULE_0__[\"default\"].call(this, parentItem)\n  this.element.classList.add(\"custom-2nd-color\", \"mx-1\")\n  this.element.dataset.name = \"list\"\n}\n\n//# sourceURL=webpack://develop/./component_classes/item/item_children/list.js?");

/***/ }),

/***/ "./component_classes/item/item_subclasses/event.js":
/*!*********************************************************!*\
  !*** ./component_classes/item/item_subclasses/event.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Event)\n/* harmony export */ });\n/* harmony import */ var _item_children_card__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../item_children/card */ \"./component_classes/item/item_children/card.js\");\n/* harmony import */ var _item_children_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../item_children/list */ \"./component_classes/item/item_children/list.js\");\n/* harmony import */ var _event_subclasses_dragging__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./event_subclasses/dragging */ \"./component_classes/item/item_subclasses/event_subclasses/dragging.js\");\n\n\n\n\nfunction Event(item, plus, trash, textarea, element, parentItem){\n  // Helper functions\n    function newCard(parent){\n      const card = new _item_children_card__WEBPACK_IMPORTED_MODULE_0__[\"default\"](parent)\n      parent.addCard(card)\n      card.focus()\n    }\n\n    function newList(board){\n      const list = new _item_children_list__WEBPACK_IMPORTED_MODULE_1__[\"default\"](board)\n      board.addList(list)\n      list.focus()\n    }\n\n    function deleteSelf(){\n      if([...trash.classList].includes('custom-red-color')){\n        element.remove()\n        return\n      }\n      trash.classList.add('custom-red-color')\n    }\n\n  // Keyboard shortcuts\n    let isShift = false\n    textarea.addEventListener(\"keydown\", event => {\n      switch(event.key){\n        case \"Shift\":\n          isShift = true; break\n        case \"Delete\":\n          deleteSelf(); break\n        case \"Tab\":\n          trash.classList.remove('custom-red-color'); break\n        case \"Enter\":\n          event.preventDefault()\n          if(isShift){\n            // Create child card\n            newCard(item); return\n          }\n          if(parentItem.getElement().dataset.name === \"board\"){\n            // Create new sibling list if a list is in focus\n            newList(parentItem); return\n          }\n          // Create new sibling card if a card is in focus\n          newCard(parentItem)\n      }\n    })\n\n    textarea.addEventListener(\"keyup\", event => {\n      if(event.key === \"Shift\") isShift = false\n    })\n\n  // Spellcheck when textarea in focus and no spellcheck when out of focus\n    textarea.addEventListener(\"focus\", () => {\n      textarea.setAttribute(\"spellcheck\", \"true\")\n    })\n\n    textarea.addEventListener(\"blur\", () => {// When textarea looses focus\n      textarea.setAttribute(\"spellcheck\", \"false\")\n    })\n\n    document.addEventListener(\"click\", (event) => {\n      switch(event.target){\n        case plus: newCard(item); return;\n        case trash: deleteSelf(); return;\n        default: trash.classList.remove('custom-red-color'); return;\n      }\n    })\n\n  //Add dragging events\n  new _event_subclasses_dragging__WEBPACK_IMPORTED_MODULE_2__[\"default\"](element)\n\n}\n\n//# sourceURL=webpack://develop/./component_classes/item/item_subclasses/event.js?");

/***/ }),

/***/ "./component_classes/item/item_subclasses/event_subclasses/dragging.js":
/*!*****************************************************************************!*\
  !*** ./component_classes/item/item_subclasses/event_subclasses/dragging.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Dragging)\n/* harmony export */ });\nfunction Dragging(element){\n  let lists\n  /* The structure of lists\n  let lists = [\n    {\n      list: listElement,\n      cards: [\n        {\n          card: cardElement,\n          cards: []\n        },\n        {\n          card: cardElement,\n          cards: []\n        },\n      ]\n    }\n  ]\n  */\n\n  function updateLists(){\n    // Set lists to []\n    lists = []\n    // Create tempObj\n    let tempObj = {\n      list: undefined,\n      cards: []\n    }\n    // Get all of the listElements\n    const listElements = document.querySelectorAll('[data-name=\"list\"]')\n    // Loop through all the listElements\n    for(let i = 0; i < listElements.length; i++){\n      const listElement = listElements[i]\n      // Set the list in the tempObj to the current listElement\n      tempObj.list = listElement\n      // Set the cards in the tempObj with getCards(listElement)\n      tempObj.cards = getCards(listElement)\n      // Add tempObj's value to lists\n      lists.push({...tempObj})\n    }\n  }\n\n  function getCards(item){\n    // Create cards to []\n    let cards = []\n    // Create tempObj\n    let tempObj = {\n      card: undefined,\n      cards: []\n    }\n    // Get all the item's direct children cards called cardElements\n    const cardElements = item.querySelectorAll(':scope > [data-name=\"card\"]')\n    // if there are no children cards then return cards. End case for recursion\n    if(cardElements.length === 0) return cards\n    // Loop through all the cardElements\n    for(let i = 0; i < cardElements.length; i++){\n      const cardElement = cardElements[i]\n      // Set the card in the tempObj to the current cardElement\n      tempObj.card = cardElement\n      // Set the cards in the tempObj to getCards(cardElement)\n      tempObj.cards = getCards(cardElement)\n      // Add tempObj to cards\n      cards.push({...tempObj})\n    }\n    // return cards\n    return cards\n  }\n\n  updateLists()\n\n  element.addEventListener(\"dragstart\", (event) => {\n    updateLists()\n  })\n\n  function listDragging(xMouse){\n    // Loop through all the lists\n    for(let i = 0; i < lists.length; i++){\n      const list = lists[i].list\n      // Exclude dragging list\n      if(element === list) continue\n      // Get rectangle of looped list\n      const listRect = list.getBoundingClientRect()\n      // Get xCenter of listRect\n      const xCenter = (listRect.left + listRect.right)/2\n      // If mouse is in the left half then put to the right\n      if(xMouse > listRect.left && xMouse < xCenter) return list.insertAdjacentElement(\"afterend\"/*After element*/, element)\n      // If mouse is in the right half then put to the left\n      if(xMouse < listRect.right && xMouse > xCenter) return list.insertAdjacentElement(\"beforebegin\"/*Before element*/, element)\n\n//      // If mouse is to the left of list put to the left\n//      if(xMouse < listRect.left) return list.insertAdjacentElement(\"beforebegin\"/*Before element*/, element)\n//      // If last list put to the right\n//      if(i === lists.length - 1) return list.insertAdjacentElement(\"afterend\"/*After element*/, element)\n    }\n  }\n\n  function cardDragging(yMouse, cards){\n    // Loop through all the cards\n    for(let i = 0; i < cards.length; i++){\n      const card = cards[i].card\n      const childrenCards = cards[i].cards\n      // Exclude dragging card\n      if(element === card) continue\n      // Get rectangle of looped card\n      const cardRect = card.getBoundingClientRect()\n      // If mouse is above card put dragging card above\n      if(yMouse < cardRect.top) return card.insertAdjacentElement(\"beforebegin\"/*Before element*/, element)\n      // If mouse is inside card\n      if(yMouse > cardRect.top && yMouse < cardRect.bottom){\n        // If card has sub cards recursion with next card layer\n        if(childrenCards.length !== 0){\n          return cardDragging(yMouse, childrenCards)\n        }else{\n          // If card doesn't have sub cards put dragging card inside\n          return card.insertAdjacentElement(\"beforeend\"/*Last child*/, element)\n        }\n      }\n      // If last card\n      if(i === cards.length - 1){\n        // If mouse is below the card put card below\n        if(yMouse > cardRect.bottom) return card.insertAdjacentElement(\"afterend\"/*After element*/, element)\n      }\n    }\n  }\n\n  element.addEventListener(\"drag\", (event) => {\n    // Prevent drag event from effecting items below this one\n    event.stopPropagation()\n    // Get x and y position of the mouse\n    const xMouse = event.clientX\n    const yMouse = event.clientY\n    // Avoid last dragging event which sets mouse to 0,0\n    if(xMouse === 0 || yMouse === 0) return\n    // If element is list\n    if(element.dataset.name === \"list\") return listDragging(xMouse)\n    // If element is card\n    if(element.dataset.name === \"card\"){\n      // Loop through all the lists\n      for(let i = 0; i < lists.length; i++){\n        const list = lists[i].list\n        const listRect = list.getBoundingClientRect()\n        const cards = lists[i].cards\n        // Find which list the dragging card is in\n        if(xMouse > listRect.left && xMouse < listRect.right){\n          // If there are cards\n          if(cards.length !== 0){\n            // Card dragging function\n            cardDragging(yMouse, cards)\n          }else{\n            // If no cards then add dragging card to the end of the list\n            list.insertAdjacentElement(\"beforeend\"/*Last Child*/, element)\n          }\n        }\n      }\n    }\n  })\n\n}\n\n//# sourceURL=webpack://develop/./component_classes/item/item_subclasses/event_subclasses/dragging.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _component_classes_board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component_classes/board */ \"./component_classes/board.js\");\n\n\n// Create a new board object\nconst board = new _component_classes_board__WEBPACK_IMPORTED_MODULE_0__[\"default\"]()\n\n// Adds board to dom\nboard.load()\n\n//# sourceURL=webpack://develop/./index.js?");

/***/ }),

/***/ "./utils/elementFromHTML.js":
/*!**********************************!*\
  !*** ./utils/elementFromHTML.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ elementFromHTML)\n/* harmony export */ });\nfunction elementFromHTML(htmlString){\n  const parser = new DOMParser()\n  return parser.parseFromString(htmlString.trim(), 'text/html').body.firstChild\n}\n\n//# sourceURL=webpack://develop/./utils/elementFromHTML.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ })()
;