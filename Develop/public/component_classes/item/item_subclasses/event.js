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

    /*
  // Plus icon
    plus.addEventListener("mouseup", () => {
      if(isDragging) return
      newCard(item)
      isDragging = false
    })

  // Trash icon
    trash.addEventListener("mouseup", () => {
      if(isDragging) return
      deleteSelf()
      isDragging = false
    })

    document.addEventListener("mouseup", event => {
      if(isDragging) return
      isDragging = false
      if(event.target !== trash){
        if([...trash.classList].includes('custom-red-color')){
          trash.classList.remove('custom-red-color')
        }
      }
    })
    */

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
            newCard(item); return
          }
          if(parentItem.getElement().dataset.name === "board"){
            newList(parentItem); return
          }
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

    textarea.addEventListener("blur", () => {
      textarea.setAttribute("spellcheck", "false")
    })

  // Dragging
    let initialX
    let initialY
    let isMouseDown = false
    let isDragging = false
    element.addEventListener("mousedown", async (event) => {
      event.stopPropagation() // Prevent lower items from moving
      //initialX = event.clientX
      //initialY = event.clientY
      initialX = event.clientX - element.offsetX
      initialY = event.clientY - element.offsetY
      console.log(`${event.offsetX}, ${event.offsetY}. `, event)
      isMouseDown = true
    })

    textarea.addEventListener("dragstart", (event) => {
      event.preventDefault()
    })

    document.addEventListener("mousemove", (event) => {
      if(!isMouseDown) return
      isDragging = true
      /*
      const x = event.clientX - initialX
      const y = event.clientY - initialY
      element.style.transform = `translate(0px, 0px)`
      */
      // Create a new element that 
      element.style.position = "absolute"
      element.style.left = event.clientX + "px"
      element.style.top = event.clientY  + "px"
      element.style.transform = `translate(-${initialX}px, -${initialY}px)`
    })

    document.addEventListener("mouseup", (event) => {
      isMouseDown = false
      if(!isDragging){
        switch(event.target){
          case plus: newCard(item); return;
          case trash: deleteSelf(); return;
          default:
            if([...trash.classList].includes('custom-red-color')){
              trash.classList.remove('custom-red-color')
            }
            return
        }
      }else{
        isDragging = false
      }
    })
}

window.Event = Event