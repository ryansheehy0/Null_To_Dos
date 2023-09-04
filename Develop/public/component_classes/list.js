function List(){
  let cards = []
  // Draggable events

  let id = window.getNewUUID()

  let element = window.elementFromHTML(`
    <div class="list" draggable="true" data-uuid="${id}">
      <textarea class="name" oninput="window.resizeTextarea(this)" rows="1" spellcheck="false"></textarea>
      <div class="buttons">
        <i class="bi bi-plus plus-icon"></i>
        <i class="bi bi-trash trash-icon"></i>
      </div>
      <!-- More cards -->
    </div>
  `)

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