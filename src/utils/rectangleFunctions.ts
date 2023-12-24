type Rect = {
  x: number
  y: number
  width: number
  height: number
}

export function isMouseInside(rect: Rect, x: number, y: number): boolean{
  if(x > rect.x && x < (rect.x + rect.width)){
    if(y > rect.y && y < (rect.y + rect.height)){
      return true
    }
  }
  return false
}