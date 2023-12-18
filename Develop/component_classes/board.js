import elementFromHTML from "../utils/elementFromHTML"
import List from "./item/item_children/list"

export default function Board(){
  // Get variables
  let element = elementFromHTML(`
    <div data-name="board" class="w-screen h-screen grid grid-flow-col overflow-x-auto justify-start">
      <div data-name="add-list-btn" class="cursor-pointer flex items-center justify-center custom-text-color custom-2nd-color w-64 min-h-8 py-1.5 px-3 mx-1 my-2 rounded-xl h-fit box-content" draggable="false">
        <img src="./assets/plus.svg" class="custom-img-color w-8 h-8" draggable="false">
        Add another list
      </div>
    </div>
  `)

  const addListBtn = element.querySelector(`[data-name="add-list-btn"]`)

  // Helper factions
  newList = () => {
    const list = new List(this)
    this.addList(list)
    list.focus()
  }

  // Event listeners
  addListBtn.addEventListener("click", () => {
    newList()
  })

  // Enter key with nothing focused creates new list
  document.addEventListener("keydown", (event) => {
    if(document.activeElement !== document.body) return // Exit if something else is in focus
    if(event.key === "Enter"){
      event.preventDefault() // Prevent new lines in newly created lists
      newList()
    }
  })

  // Methods
  this.getElement = function(){return element}

  this.addList = function(list){
    // Put list inside board
    addListBtn.insertAdjacentElement(`beforebegin` /*Above*/, list.getElement())
  }

  this.load = function(){
    // Remove existing board
    const existingBoard = document.querySelector(`[data-name="board"]`)
    if(existingBoard) existingBoard.remove()
    // Get the navbar
    const navbar = document.querySelector(`#navbar`)
    // Add this board
    navbar.insertAdjacentElement(`afterend` /*After Element*/, element)
  }
}