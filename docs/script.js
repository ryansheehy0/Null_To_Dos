// Todo
  // Delete button
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

document.querySelector("body").addEventListener("click", (event) => {
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
    console.log("trash-icon")
  }
})

function autoResize(textarea) {
  textarea.style.height = "fit-content";
  textarea.style.height = textarea.scrollHeight + "px"
}
