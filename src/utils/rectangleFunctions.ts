/*
 * This file is part of Null Todos.
 *
 * Null Todos is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Null Todos is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Null Todos. If not, see <https://www.gnu.org/licenses/>.
 */

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
  const yCenter = (rect.top + rect.bottom) / 2
  if(y < yCenter){
    return "above"
  }else{
    return "below"
  }
}

export function isMouseLeftOrRightCenter(rect: Rect, x: number): "left" | "right"{
  const xCenter = (rect.left + rect.right) / 2
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