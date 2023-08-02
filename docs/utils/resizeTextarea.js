window.resizeTextarea = (textarea) => {
  // Resizes the textarea so that it fits the content
  textarea.style.height = "fit-content";
  textarea.style.height = textarea.scrollHeight + "px"
  textarea.textContent = textarea.value // Sets the value in the dom so it can be saved with local storage
  localStorage.setItem("body", document.body.innerHTML)
}