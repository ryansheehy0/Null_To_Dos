function Board(element){
  let lists = []

  this.addList = function(list){
    // Add list to lists
    lists.push(list)
    // Put list inside board at the end
    element.insertAdjacentElement("beforeend"/*Last Child*/, list)
  }

  this.removeList = function(list){
    // Remove list from lists
    lists = lists.filter(item => {
      if(item === list){
        return false
      }
    })
    // Remove list form board
    element.removeChild(list)
  }

  this.getJson = function(){
    // Return the json
  }

}