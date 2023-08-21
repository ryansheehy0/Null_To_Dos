const board = new window.Board(document.querySelector("#board"))

const addListBtn = document.querySelector("#add-list-btn")

addListBtn.addEventListener("click", () => {
  const list = new window.List()
  board.addList(list)
})