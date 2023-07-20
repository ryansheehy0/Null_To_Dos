function layer(card, list){
  let layer = 1
  let parent = card.parentElement
  while(parent !== list){
    layer++
    parent = parent.parentElement
  }
  return layer
}

function isLast(card){
  const parentId = card.parentElement.id
  const siblings = [...card.parentElement.querySelectorAll(`#${parentId} > .card:not(.dragging)`)]
  if(siblings[siblings.length - 1] === card){
    return true
  }
  return false
}

function getCardsPos(list, y){
  const draggableCards = [...list.querySelectorAll(".card:not(.dragging)")]

  let cardsPos = []

  //let offset = Number.POSITIVE_INFINITY
  draggableCards.forEach(card => {
    const box = card.getBoundingClientRect()
    const isAbove = y - box.top < 0 ? true : false
    const isBelow = y - box.bottom > 0 ? true : false
    const isInside = !isAbove && !isBelow ? true : false
    const hasChildren = card.querySelector(".card:not(.dragging)") !== null
    cardsPos.push({isAbove: isAbove, isBelow: isBelow, isInside: isInside, card: card, layer: layer(card, list), hasChildren: hasChildren, isLast: isLast(card)})
  })
  return cardsPos
}

function setListsEvents(){
  const lists = [...document.querySelectorAll(".list")]
  lists.forEach(list => {
    list.addEventListener("dragover", event => {
      event.preventDefault() // Changes the cursor
      const cardsPos = getCardsPos(list, event.clientY)
      console.log(cardsPos)
      const draggingCard = document.querySelector(".dragging")

      let layer = 1
      for(let i=0; i < cardsPos.length; i++){
        let cardPos = cardsPos[i]

        if(cardPos.layer === layer){
          if(cardPos.isInside){
            if(cardPos.hasChildren){
              layer++
              continue
            }else{
              cardPos.card.insertAdjacentElement("beforeend", draggingCard)
              console.log("child of: " + cardPos.card.querySelector(".name").textContent)
              break
            }
          }else if(cardPos.isAbove){
            cardPos.card.insertAdjacentElement("beforebegin", draggingCard)
            console.log("before: " + cardPos.card.querySelector(".name").textContent)
            break
          }else if(cardPos.isBelow && cardPos.isLast){
            cardPos.card.insertAdjacentElement("afterend", draggingCard)
            console.log("after: " + cardPos.card.querySelector(".name").textContent)
            break
          }
        }
      }
    })
  })
}

function setCardsEvents(){
  const cards = [...document.querySelectorAll(".card")]
  cards.forEach(card => {
    card.addEventListener("dragstart", event => {
      if(card === event.target){
        card.classList.add("dragging")
      }
    })
    card.addEventListener("dragend", () => {
        card.classList.remove("dragging")
    })
  })
}

function setDraggingEvents() {
  setListsEvents()
  setCardsEvents()
}

// Export
window.draggingEvents = {
  setDraggingEvents
}
