// Todo
  // Local storage for lists
  // Autofocus when creating new list/card
  // Enter key to remove focus from input
  // Input can have line wrap
  // Input gets resized to the buttons
  // Stack cards

let addListBtn = document.querySelector("#add-list-btn")
addListBtn.addEventListener("click", () => {
  addListBtn.insertAdjacentHTML("beforebegin", `
    <div class="list">
      <input type="text" class="name"></input>
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
        <input type="text" class="name"></input>
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
