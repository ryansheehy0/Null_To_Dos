function layer(card, list){
  // Gets the layer of the card. Layers start at 1
  let layer = 1
  let parent = card.parentElement
  while(parent !== list){
    layer++
    parent = parent.parentElement
  }
  return layer
}

function isLast(card){
  // Sees if the card is the last of its sibling cards
  const parent = card.parentElement
  const parentId = parent.dataset.uuid
  const siblings = [...parent.querySelectorAll(`[data-uuid="${parentId}"] > .card:not(.dragging)`)]
  if(siblings[siblings.length - 1] /*Last Element*/ === card){
    return true
  }
  return false
}

function getCardsPos(list, y){
  const cardsNotBeingDragged = [...list.querySelectorAll(".card:not(.dragging)")]

  let cardsPos = []

  // Gets the position information of all the cards that aren't being dragged
  cardsNotBeingDragged.forEach(card => {
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

      const draggingCard = document.querySelector(".dragging")

      if(draggingCard.classList.contains("list")){
        return
      }

      const cardsPos = getCardsPos(list, event.clientY)

      if(cardsPos.length === 0){ // If the list doesn't have any children
        list.insertAdjacentElement("beforeend" /*Last Child*/, draggingCard)
        return
      }

      let layer = 1
      for(let i=0; i < cardsPos.length; i++){
        let cardPos = cardsPos[i]

        if(cardPos.layer === layer){
          if(cardPos.isInside){
            if(cardPos.hasChildren){
              layer++
              continue
            }else{
              cardPos.card.insertAdjacentElement("beforeend"/*Last Child*/, draggingCard)
              break
            }
          }else if(cardPos.isAbove){
            cardPos.card.insertAdjacentElement("beforebegin"/*Before Element*/, draggingCard)
            break
          }else if(cardPos.isBelow && cardPos.isLast){
            cardPos.card.insertAdjacentElement("afterend"/*After Element*/, draggingCard)
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
        localStorage.setItem("body", document.body.innerHTML)
    })
  })
}

window.cardDraggingEventsInit = () => {
  setListsEvents()
  setCardsEvents()
}