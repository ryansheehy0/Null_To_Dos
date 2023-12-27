export type Cards = {
  id: number
  name: string
  cards: Cards
}

export type Lists = {
  id: number
  name: string
  cards: Cards
}

export type Board = {
  id: number
  name: string
  lists: Lists
}