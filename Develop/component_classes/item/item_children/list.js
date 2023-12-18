import Item from "../item"

export default function List(parentItem){
  Item.call(this, parentItem)
  this.element.classList.add("custom-2nd-color", "mx-1")
  this.element.dataset.name = "list"
}