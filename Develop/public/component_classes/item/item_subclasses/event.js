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
      const rect = element.getBoundingClientRect()
      // Get x,y coordinates inside element
      initialX = event.clientX - rect.left + 3.5
      initialY = event.clientY - rect.top + 7
      isMouseDown = true
    })

    textarea.addEventListener("dragstart", (event) => {
      event.preventDefault()
    })

    document.addEventListener("mousemove", (event) => {
      if(!isMouseDown) return
      isDragging = true

      // Prevent mouse from moving out of the screen

      // Add styles to element
      element.style.position = "absolute"
      element.style.left = event.clientX + "px"
      element.style.top = event.clientY  + "px"
      element.style.transform = `translate(-${initialX}px, -${initialY}px)`
      element.classList.add("z-1")
    })

    document.addEventListener("mouseup", (event) => {
      isMouseDown = false
      if(!isDragging){
        switch(event.target){
          case plus: newCard(item); return;
          case trash: deleteSelf(); return;
          default: trash.classList.remove('custom-red-color'); return;
        }
      }else{
        isDragging = false
        element.classList.remove("z-1")
      }
    })
}

window.Event = Event