function Dragging(element){
  let lists
  /* The structure of lists
  let lists = [
    {
      list: listElement,
      cards: [
        {
          card: cardElement,
          cards: []
        },
        {
          card: cardElement,
          cards: []
        },
      ]
    }
  ]
  */

  function updateLists(){
    // Set lists to []
    lists = []
    // Create tempObj
    let tempObj = {
      list: undefined,
      cards: []
    }
    // Get all of the listElements
    const listElements = document.querySelectorAll('[data-name="list"]')
    // Loop through all the listElements
    for(let i = 0; i < listElements.length; i++){
      const listElement = listElements[i]
      // Set the list in the tempObj to the current listElement
      tempObj.list = listElement
      // Set the cards in the tempObj with getCards(listElement)
      tempObj.cards = getCards(listElement)
      // Add tempObj's value to lists
      lists.push({...tempObj})
    }
  }

  function getCards(item){
    // Create cards to []
    let cards = []
    // Create tempObj
    let tempObj = {
      card: undefined,
      cards: []
    }
    // Get all the item's direct children cards called cardElements
    const cardElements = item.querySelectorAll(':scope > [data-name="card"]')
    // if there are no children cards then return cards. End case for recursion
    if(cardElements.length === 0) return cards
    // Loop through all the cardElements
    for(let i = 0; i < cardElements.length; i++){
      const cardElement = cardElements[i]
      // Set the card in the tempObj to the current cardElement
      tempObj.card = cardElement
      // Set the cards in the tempObj to getCards(cardElement)
      tempObj.cards = getCards(cardElement)
      // Add tempObj to cards
      cards.push({...tempObj})
    }
    // return cards
    return cards
  }

  updateLists()

  element.addEventListener("dragstart", (event) => {
    updateLists()
  })

  function listDragging(xMouse){
    // Loop through all the lists
    for(let i = 0; i < lists.length; i++){
      const list = lists[i].list
      // Exclude dragging list
      if(element === list) continue
      // Get rectangle of looped list
      const listRect = list.getBoundingClientRect()
      // Get xCenter of listRect
      const xCenter = (listRect.left + listRect.right)/2
      // If mouse is in the left half then put to the right
      if(xMouse > listRect.left && xMouse < xCenter) return list.insertAdjacentElement("afterend"/*After element*/, element)
      // If mouse is in the right half then put to the left
      if(xMouse < listRect.right && xMouse > xCenter) return list.insertAdjacentElement("beforebegin"/*Before element*/, element)

//      // If mouse is to the left of list put to the left
//      if(xMouse < listRect.left) return list.insertAdjacentElement("beforebegin"/*Before element*/, element)
//      // If last list put to the right
//      if(i === lists.length - 1) return list.insertAdjacentElement("afterend"/*After element*/, element)
    }
  }

  function cardDragging(yMouse, cards){
    // Loop through all the cards
    for(let i = 0; i < cards.length; i++){
      const card = cards[i].card
      const childrenCards = cards[i].cards
      // Exclude dragging card
      if(element === card) continue
      // Get rectangle of looped card
      const cardRect = card.getBoundingClientRect()
      // If mouse is above card put dragging card above
      if(yMouse < cardRect.top) return card.insertAdjacentElement("beforebegin"/*Before element*/, element)
      // If mouse is inside card
      if(yMouse > cardRect.top && yMouse < cardRect.bottom){
        // If card has sub cards recursion with next card layer
        if(childrenCards.length !== 0){
          return cardDragging(yMouse, childrenCards)
        }else{
          // If card doesn't have sub cards put dragging card inside
          return card.insertAdjacentElement("beforeend"/*Last child*/, element)
        }
      }
      // If last card
      if(i === cards.length - 1){
        // If mouse is below the card put card below
        if(yMouse > cardRect.bottom) return card.insertAdjacentElement("afterend"/*After element*/, element)
      }
    }
  }

  element.addEventListener("drag", (event) => {
    // Prevent drag event from effecting items below this one
    event.stopPropagation()
    // Get x and y position of the mouse
    const xMouse = event.clientX
    const yMouse = event.clientY
    // Avoid last dragging event which sets mouse to 0,0
    if(xMouse === 0 || yMouse === 0) return
    // If element is list
    if(element.dataset.name === "list") return listDragging(xMouse)
    // If element is card
    if(element.dataset.name === "card"){
      // Loop through all the lists
      for(let i = 0; i < lists.length; i++){
        const list = lists[i].list
        const listRect = list.getBoundingClientRect()
        const cards = lists[i].cards
        // Find which list the dragging card is in
        if(xMouse > listRect.left && xMouse < listRect.right){
          // If there are cards
          if(cards.length !== 0){
            // Card dragging function
            cardDragging(yMouse, cards)
          }else{
            // If no cards then add dragging card to the end of the list
            list.insertAdjacentElement("beforeend"/*Last Child*/, element)
          }
        }
      }
    }
  })

}

window.Dragging = Dragging