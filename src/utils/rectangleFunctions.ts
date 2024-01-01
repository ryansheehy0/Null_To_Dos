type Rect = {
  x: number
  y: number
  width: number
  height: number
  left: number
  right: number
}

export function isMouseInside(rect: Rect, x: number, y: number): boolean{
  if(x > rect.x && x < (rect.x + rect.width)){
    if(y > rect.y && y < (rect.y + rect.height)){
      return true
    }
  }
  return false
}

export function isMouseAboveOrBelowCenter(rect: Rect, y: number): "above" | "below"{
  const yCenter = (rect.y + (rect.y + rect.height)) / 2
  if(y < yCenter){
    return "above"
  }else{
    return "below"
  }
}

export function isMouseLeftOrRightCenter(rect: Rect, x: number): "left" | "right"{
  const xCenter = (rect.x + (rect.x + rect.width)) / 2
  if(x < xCenter){
    return "left"
  }else{
    return "right"
  }
}

export function isMouseLeftOrRightHalf(rect: Rect, x: number): "left" | "right" | "neither"{
  const xCenter = (rect.left + rect.right) / 2
  if(x > rect.left && x < xCenter) return "left"
  if(x < rect.right && x > xCenter) return "right"
  return "neither"
}