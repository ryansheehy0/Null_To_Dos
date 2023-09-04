// Create a new board
const board = new window.Board(document.querySelector(`#board`))

// Get the add list button
const addListBtn = document.querySelector("#add-list-btn")

addListBtn.addEventListener("click", () => {
  const list = new window.List()
  board.addList(list)
})