function Dragging(element, textarea){
  // Allow the element to be dragged
  // Check if the element is a card or list
    // Find which position the blank element goes
  // 


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
      event.preventDefault() // Prevent textarea from dragging
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
        // Send event
        const mouseupNotDraggingEvent = new CustomEvent("mouseupNotDragging", {
          detail: {target: event.target}
        })
        element.dispatchEvent(mouseupNotDraggingEvent)
      }else{
        isDragging = false
        element.classList.remove("z-1")
      }
    })
}

window.Dragging = Dragging