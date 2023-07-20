// Todo
  // Drag cards around
    // Learn and comment
    // Put cards in other cards
  // Change things from let to const and clean code
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

// imports
const uuid = window.uuid
const waitForDOM = window.waitForDOM
const draggingEvents = window.draggingEvents

let bodyHTML = localStorage.getItem("body")
if(bodyHTML === null){
  listsAndCards = ""
}else{
  document.body.innerHTML = bodyHTML
}

// Add new list
let addListBtn = document.querySelector("#add-list-btn")
addListBtn.addEventListener("click", async () => {
  let listUUID = "a" + uuid.getUUID() // querySelector needs letter in front for some reason
  addListBtn.insertAdjacentHTML("beforebegin",`
    <div class="list" id="${listUUID}">
      <textarea class="name" oninput="autoResize(this)" rows="1" spellcheck="false"></textarea>
      <div class="buttons">
        <i class="bi bi-plus plus-icon"></i>
        <i class="bi bi-trash trash-icon"></i>
      </div>
      <!-- More cards -->
    </div>
  `)
  // Get the newly created list
    let list = await waitForDOM.waitForElm(`#${listUUID}`)
  // Set focus
    list.querySelector(".name").focus()
  // Set local storage
    localStorage.setItem("body", document.body.innerHTML)
})

// Add and delete button
let modal = document.querySelector("#modal")
let cancel = document.querySelector("#cancel")
let ok = document.querySelector("#ok")
let bodyContainer = document.querySelector("#body-container")
document.body.addEventListener("click", async (event) => {
  // Add button. Don't include the plus sign on Add another list button.
  if(event.target.className.includes("plus-icon") && event.target.parentNode.className.includes("buttons")){
    let parentListOrCard = event.target.parentNode.parentNode// Gets which button the plus icon is in
    let cardUUID = "a" + uuid.getUUID() // querySelector needs letter in front for some reason
    parentListOrCard.insertAdjacentHTML("beforeend", `
      <div class="card" draggable="true" id="${cardUUID}">
        <textarea class="name" oninput="autoResize(this)" rows="1" spellcheck="false"></textarea>
        <div class="buttons">
          <i class="bi bi-plus plus-icon"></i>
          <i class="bi bi-trash trash-icon"></i>
        </div>
        <!-- More cards -->
      </div>
    `)
    // Get newly created card
      let card = await waitForDOM.waitForElm(`#${cardUUID}`)
    // Set focus
      card.querySelector(".name").focus()
    // Set local storage
      localStorage.setItem("body", document.body.innerHTML)
  }
  // Delete button
  if(event.target.className.includes("trash-icon")){
    modal.style.visibility = "visible"; // Show modal
    bodyContainer.style.pointerEvents = "none" // Don't allow clicking the background
    // OK is pressed
    let okEventListener = () => {
      event.target.parentNode.parentNode.remove()
      modal.style.visibility = "hidden";
      bodyContainer.style.pointerEvents = "auto" // Allow clicking the background
      localStorage.setItem("body", document.body.innerHTML)
    }
    ok.addEventListener("click", okEventListener)
    // Cancel is pressed
    cancel.addEventListener("click", () => {
      modal.style.visibility = "hidden";
      bodyContainer.style.pointerEvents = "auto" // Allow clicking the background
      ok.removeEventListener("click", okEventListener);
    })
  }
})

// Resize text input
function autoResize(textarea) {
  textarea.style.height = "fit-content";
  textarea.style.height = textarea.scrollHeight + "px"
  textarea.textContent = textarea.value
  localStorage.setItem("body", document.body.innerHTML)
}

draggingEvents.setDraggingEvents()
