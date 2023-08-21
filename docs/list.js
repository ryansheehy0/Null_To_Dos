window.List = List
function List(){
  let name = ""
  let id = ""
  let cards = []
  let html = ""
  // Dragable events
  let element // document.querySelector

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