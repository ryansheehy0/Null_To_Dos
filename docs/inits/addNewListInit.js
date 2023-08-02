window.addNewListInit = () => {
  // Dom elements
  const addListBtn = document.querySelector("#add-list-btn")

  addListBtn.addEventListener("click", () => {
    const listUUID = window.getNewUUID()
    addListBtn.insertAdjacentHTML("beforebegin" /*Before Element*/,`
      <div class="list" draggable="true" data-uuid="${listUUID}">
        <textarea class="name" oninput="window.resizeTextarea(this)" rows="1" spellcheck="false"></textarea>
        <div class="buttons">
          <i class="bi bi-plus plus-icon"></i>
          <i class="bi bi-trash trash-icon"></i>
        </div>
        <!-- More cards -->
      </div>
    `)
    // Get the newly created list
      const list = document.querySelector(`.list[data-uuid="${listUUID}"]`)
    // Set focus
      list.querySelector(".name").focus()
    // Set dragging events for the newly created list
      window.cardDraggingEventsInit()
    // Set clicking in textarea
      window.clickInTextareasInit()
    // Set local storage
      localStorage.setItem("body", document.body.innerHTML)
  })
}