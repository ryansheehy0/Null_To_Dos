window.clickInTextareasInit = () => {
  const textareas = [...document.querySelectorAll("textarea")]
  textareas.forEach(textarea => {
    textarea.addEventListener("click", event => {
      const cursorPosition = document.caretPositionFromPoint(event.clientX, event.clientY).offset
      textarea.selectionStart = cursorPosition
      textarea.selectionEnd = cursorPosition
    })
  })
}