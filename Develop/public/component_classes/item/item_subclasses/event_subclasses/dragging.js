function Dragging(element){
  let listBoundingBoxes = [] // Needs to be ordered
  let cardBoundingBoxes = [] // Needs to be ordered

  function updateBoundingBoxes(){
    // Update the bounding boxes of all the lists and cards
    
  }

  updateBoundingBoxes()

  element.addEventListener("dragging", (event) => {
    // Get x and y position of the mouse
    const xMouse = event.clientX
    // If a list then set which lists are to the left and right
    if(element.dataset.name === "list"){
      listBoundingBoxes.forEach((list) => {
        if(xMouse < list.left && xMouse > list.right){ // If inside list

        }
      })
    }
    // If a card
      // set which list the card is in
      // set the cards above and below
  })

  element.addEventListener("dragend", (event) => {
    updateBoundingBoxes()
  })
}

window.Dragging = Dragging