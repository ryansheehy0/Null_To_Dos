type Rect = {
  x: number
  y: number
  width: number
  height: number
  left: number
  right: number
  top: number
  bottom: number
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

export function isMouseAboveInsideOrBelow(rect: Rect, y: number): "above" | "inside" | "below"{
  if(y < rect.top){
    return "above"
  }else if(y > rect.bottom){
    return "below"
  }else{
    return "inside"
  }
}

export function isMouseHorizontallyInside(rect: Rect, x: number): boolean{
  if(x > rect.left && x < rect.right) return true
  return false
}

export function isValidRect(rect: Rect){
  // Invalid rects have all their properties set to 0
  if(rect.width === 0 && rect.height === 0){
    return false
  }
  return true
}