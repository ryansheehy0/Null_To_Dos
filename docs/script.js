// Todo
// Paid options. Cheaper than $5 a month
  // Work with other people like google docs
  // Can have multiple different pages
  // Can change the theme and other settings
    // Toggle spell checking
// Possible features
  // Enter to create new list like trello
    // Disable default behavior of enter key for textarea. Shift enter to create new line.
    // Enter key presses the parent's add/plus button. Need autofocus done before this feature
  // Make logo and maybe rename

const bodyHTML = localStorage.getItem("body")
if(bodyHTML !== null){
  document.body.innerHTML = bodyHTML
}

window.addNewListInit()

// If something on the body is clicked
document.body.addEventListener("click", (event) => {
  window.plusButtonInit(event)
  window.trashButtonInit(event)
})

window.cardDraggingEventsInit()
window.listDraggingEventsInit()

window.clickInTextareasInit()