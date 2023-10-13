function Event(item, plus, trash, textarea, element, parentItem){
  // Helper functions
    function newCard(parent){
      const card = new window.Card(parent)
      parent.addCard(card)
      card.focus()
    }

    function newList(board){
      const list = new window.List(board)
      board.addList(list)
      list.focus()
    }

    function deleteSelf(){
      if([...trash.classList].includes('custom-red-color')){
        element.remove()
        return
      }
      trash.classList.add('custom-red-color')
    }

  // Keyboard shortcuts
    let isShift = false
    textarea.addEventListener("keydown", event => {
      switch(event.key){
        case "Shift":
          isShift = true; break
        case "Delete":
          deleteSelf(); break
        case "Tab":
          trash.classList.remove('custom-red-color'); break
        case "Enter":
          event.preventDefault()
          if(isShift){
            // Create child card
            newCard(item); return
          }
          if(parentItem.getElement().dataset.name === "board"){
            // Create new sibling list if a list is in focus
            newList(parentItem); return
          }
          // Create new sibling card if a card is in focus
          newCard(parentItem)
      }
    })

    textarea.addEventListener("keyup", event => {
      if(event.key === "Shift") isShift = false
    })

  // Spellcheck when textarea in focus and no spellcheck when out of focus
    textarea.addEventListener("focus", () => {
      textarea.setAttribute("spellcheck", "true")
    })

    textarea.addEventListener("blur", () => {// When textarea looses focu
      textarea.setAttribute("spellcheck", "false")
    })

    document.addEventListener("click", (event) => {
      switch(event.target){
        case plus: newCard(item); return;
        case trash: deleteSelf(); return;
        default: trash.classList.remove('custom-red-color'); return;
      }
    })

  //Add dragging events
  new window.Dragging(element)

}

window.Event = Event