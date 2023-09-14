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

  // Plus icon
    plus.addEventListener("click", () => {
      newCard(item)
    })

  // Trash icon
    trash.addEventListener("click", () => {
      deleteSelf()
    })

    document.addEventListener("click", event => {
      if(event.target !== trash){
        if([...trash.classList].includes('custom-red-color')){
          trash.classList.remove('custom-red-color')
        }
      }
    })

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
    element.addEventListener("mousedown", (event) => {
      initialX = event.clientX
      initialY = event.clientY
      isMouseDown = true
      console.log("mousedown")
    })

    textarea.addEventListener("dragstart", (event) => {
      event.preventDefault()
    })

    document.addEventListener("mousemove", (event) => {
      if(!isMouseDown) return
      console.log(`moving mouse`)
    })

    document.addEventListener("mouseup", () => {
      isMouseDown = false
      console.log("mouseup")
    })
}

window.Event = Event