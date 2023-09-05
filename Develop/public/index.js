// Create a new board object
const board = new window.Board()

// Adds board to dom
board.load()

// Get the add list button
const addListBtn = document.querySelector("#add-list-btn")

addListBtn.addEventListener("click", () => {
  const list = new window.List()
  board.addList(list)
})