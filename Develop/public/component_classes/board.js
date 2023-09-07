function Board(){
  let lists = []

  // Get lists and cards from db

  let element = window.elementFromHTML(`
    <div data-name="board" class="w-screen h-screen grid grid-flow-col overflow-x-auto justify-start">
      <div id="add-list-btn" class="cursor-pointer flex items-center justify-center custom-text-color custom-2nd-color w-64 min-h-8 py-1.5 px-3 mx-1 my-2 rounded-xl h-fit box-content">
        <img src="./assets/plus.svg" class="custom-img-color w-8 h-8">
        Add another list
      </div>
    </div>
  `)

  this.getElement = function(){return element}

  this.addList = function(list){
    // Get add-list-btn inside board
    const addListBtn = element.querySelector(`#add-list-btn`)
    // Put list inside board
    addListBtn.insertAdjacentElement(`beforebegin` /*Above*/, list.getElement())
  }

  this.load = function(){
    // Remove existing board
    const existingBoard = document.querySelector(`#board`)
    if(existingBoard) existingBoard.remove()
    // Get the navbar
    const navbar = document.querySelector(`#navbar`)
    // Add this board
    navbar.insertAdjacentElement(`afterend` /*After Element*/, element)
  }
}

window.Board = Board