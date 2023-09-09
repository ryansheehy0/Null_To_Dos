# [Null Todo App](https://ryansheehy0.github.io/Null_Todo_App/)
A simple todo app that allows nested todos.

![screenshot](./screenshot.png)

## Features
- Nested todos where the lowest todo is a fixed width.
- Drag and drop todo cards like trello.
- Rename todos with one click like trello.
- When trash icon is clicked a popup modal is show which confirms the delete.

- When changing components its important to ensure that their credentials check.
  - Someone could change the UUID in the dom and try and change someone else's card names
- Change "s and 's to `s

- Change colors to tailwind colors. There is a good reasons why they are the way they are.

## Todo
- Add dragging
- Side bar stuff
- SQL/db stuff
- When textarea is in focus spellchecking. When not in focus not spell checking.

## Keyboard Shortcuts

| Keys          | Description           |
|---------------|-----------------------|
| Enter         | New sibling card/list |
| Shift + Enter | New child card        |
| Tab           | Next Focus            |
| Shift + Tab   | Prev Focus            |
| Delete        | Delete card/list      |