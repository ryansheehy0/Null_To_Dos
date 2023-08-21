function Card(){
  let cards = []

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