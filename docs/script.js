// Todo
  // Autofocus when creating new list/card
  // Local storage for lists
  // Enter to create new list like trello
    // Disable default behavior of enter key for textarea. Shift enter to create new line.
    // Enter key presses the parent's add/plus button. Need autofocus done before this feature
  // Drag cards around
  // Make logo and maybe rename
// Paid options. Cheaper than $5 a month
  // Work with other people like google docs
  // Can have multiple different pages
  // Can change the theme and other settings

// Add new list
let addListBtn = document.querySelector("#add-list-btn")
addListBtn.addEventListener("click", () => {
  addListBtn.insertAdjacentHTML("beforebegin", `
    <div class="list">
      <textarea class="name" oninput="autoResize(this)" rows="1"></textarea>
      <div class="buttons">
        <i class="bi bi-plus plus-icon"></i>
        <i class="bi bi-trash trash-icon"></i>
      </div>
      <!-- More cards -->
    </div>
  `)
})

// Add and delete button
let modal = document.querySelector("#modal")
let cancel = document.querySelector("#cancel")
let ok = document.querySelector("#ok")
let bodyContainer = document.querySelector("#body-container")
document.body.addEventListener("click", (event) => {
  if(event.target.className.includes("plus-icon") && event.target.parentNode.className.includes("buttons")){
    event.target.parentNode.parentNode.insertAdjacentHTML("beforeend", `
      <div class="card">
        <textarea class="name" oninput="autoResize(this)" rows="1"></textarea>
        <div class="buttons">
          <i class="bi bi-plus plus-icon"></i>
          <i class="bi bi-trash trash-icon"></i>
        </div>
        <!-- More cards -->
      </div>
    `)
  }
  if(event.target.className.includes("trash-icon")){
    modal.style.visibility = "visible"; // Show modal
    bodyContainer.style.pointerEvents = "none" // Don't allow clicking the background
    cancel.addEventListener("click", () => {
      modal.style.visibility = "hidden";
      bodyContainer.style.pointerEvents = "auto" // Allow clicking the background
    })
    ok.addEventListener("click", () => {
      event.target.parentNode.parentNode.remove()
      modal.style.visibility = "hidden";
      bodyContainer.style.pointerEvents = "auto" // Allow clicking the background
    })
  }
})

// Resize text input
function autoResize(textarea) {
  textarea.style.height = "fit-content";
  textarea.style.height = textarea.scrollHeight + "px"
}
