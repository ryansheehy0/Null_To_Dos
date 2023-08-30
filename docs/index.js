//Todo: Add comments

// Create a new board
const board = new window.Board()

// Add board to body
document.body.insertAdjacentElement("afterbegin"/*First Child*/, board.getElement())

// Get the add list button
const addListBtn = document.querySelector("#add-list-btn")

addListBtn.addEventListener("click", () => {
  const list = new window.List()
  board.addList(list)
})