function List(parentItem){
  window.Item.call(this, parentItem)
  this.element.classList.add("custom-2nd-color", "mx-1")
  this.element.dataset.name = "list"
}

window.List = List