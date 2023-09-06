function List(){
  let cards = []
  // Draggable events

  let uuid = window.getNewUUID()

  let element = window.elementFromHTML(`
    <div data-name="list" class="custom-text-color rounded-xl py-1.5 px-3 min-w-[16rem] w-fit grid grid-cols-[auto_auto] min-h-8 h-fit mx-1 my-2 custom-2nd-color box-content" draggable="true" data-uuid="${uuid}">
      <textarea data-name="name" class="m-0 flex items-center border-none bg-transparent custom-text-color text-base h-fit resize-none mt-auto mb-auto focus:outline-none" oninput="window.resizeTextarea(this)" rows="1" spellcheck="false"></textarea>
      <div data-name="buttons" class="flex items-center justify-end">
        <img src="./assets/plus.svg" class="custom-img-color w-8 h-8">
        <img src="./assets/trash.svg" class="custom-img-color w-5 h-5">
      </div>
      <!-- More cards -->
    </div>
  `)

/*
.name:focus{
  border-radius: 5px;
  outline: none;
  outline: 1px solid var(--light);
}
*/

  this.getElement = function(){return element}

  this.addCard = function(card){
    cards.push(card)
  }

  this.removeCard = function(id){
    cards = cards.filter(card => {
      if(card.id === id){
        return false
      }
    })
  }
}

window.List = List