window.plusButtonInit = (event) => {
  // Don't include the plus icon on the "Add another list" button.
  if(event.target.className.includes("plus-icon") && event.target.parentNode.className.includes("buttons")){
    // Gets which card or list the plus icon is in
      const parentListOrCard = event.target.parentNode.parentNode
    // Get new UUID
      const cardUUID = window.getNewUUID()

    parentListOrCard.insertAdjacentHTML("beforeend" /*Last Child*/, `
      <div class="card" draggable="true" data-uuid="${cardUUID}">
        <textarea class="name" oninput="window.resizeTextarea(this)" rows="1" spellcheck="false"></textarea>
        <div class="buttons">
          <i class="bi bi-plus plus-icon"></i>
          <i class="bi bi-trash trash-icon"></i>
        </div>
        <!-- More cards -->
      </div>
    `)
    // Get newly created card
      const card = document.querySelector(`.card[data-uuid="${cardUUID}"]`)
    // Set focus
      card.querySelector(".name").focus()
    // Set dragging events for the newly created card
      window.cardDraggingEventsInit()
    // Set clicking in text area events
      window.clickInTextareasInit()
    // Set local storage
      localStorage.setItem("body", document.body.innerHTML)
  }
}