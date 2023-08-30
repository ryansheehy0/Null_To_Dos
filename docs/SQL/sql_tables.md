Users

| email           | password        |
|-----------------|-----------------|
| user1@email.com | hashed password |
| user2@email.com | hashed password |


Boards

| board_id | email           | board_name |
|----------|-----------------|------------|
| 1        | user1@email.com | Personal   |
| 2        | user1@email.com | Work       |
| 3        | user2@email.com | Important  |


Lists

| list_id | board_id | list_name   |
|---------|----------|-------------|
| 1       | 1        | To Do       |
| 2       | 1        | In Progress |
| 3       | 2        | Tasks       |
| 4       | 3        | Urgent      |


Card_Layer_1

| card_layer_1_id | list_id | card_name   |
|-----------------|---------|-------------|
| 1               | 1       | Task 1      |
| 2               | 1       | Task 2      |
| 3               | 2       | Task 3      |
| 4               | 3       | Important 1 |


Card_Layer_2

| card_layer_2_id | card_layer_1_id | card_name   |
|-----------------|-----------------|-------------|
| 1               | 1               | Sub Task 1  |
| 2               | 1               | Sub Task 2  |
| 3               | 2               | Sub Task 3  |
| 4               | 3               | Important 1 |


```javascript
[
  {
    "email": "user1@email.com",
    "password": "hashed password",
    "boards": [
      {
        "board_name": "Personal",
        "lists": [
          {
            "list_name": "To Do",
            "cards_layer_1": [
              {
                "card_layer_1_name": "Task 1",
                "cards_layer_2": [
                  { "card_layer_2_name": "Sub Task 1" },
                  { "card_layer_2_name": "Sub Task 2" }
                ]
              },
              {
                "card_layer_1_name": "Task 2"
              }
            ]
          },
          {
            "list_name": "In Progress",
            "cards_layer_1": [
              { "card_layer_1_name": "Task 3" }
            ]
          }
        ]
      },
      {
        "board_name": "Work"
      }
    ]
  },
  {
    "email": "user2@email.com",
    "password": "hashed password",
    "boards": [
      {
        "board_name": "Important",
        "lists": [
          {
            "list_name": "Urgent",
            "cards_layer_1": [
              { "card_layer_1_name": "Important 1" }
            ]
          }
        ]
      }
    ]
  }
]
```

```SQL
CREATE DATABASE null_todo_app;
USE null_todo_app;

CREATE TABLE users (
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  PRIMARY KEY (email)
);

INSERT INTO users (email, password)
VALUES
  ('user1@email.com', 'hashed password'),
  ('user2@email.com', 'hashed password')
;

CREATE TABLE boards (
  id BIGINT NOT NULL AUTO_INCREMENT,
  email TEXT NOT NULL,
  board_name TEXT,
  PRIMARY KEY (id),
  FOREIGN KEY (email) REFERENCES users(email)
);

INSERT INTO boards (email, board_name)
VALUES
  ('user1@email.com', 'personal'),
  ('user1@email.com', 'work'),
  ('user2@email.com', 'important')
;

CREATE TABLE lists (
  id BIGINT NOT NULL AUTO_INCREMENT,
  board_id BIGINT NOT NULL,
  list_name TEXT,
  PRIMARY KEY (id),
  FOREIGN KEY (board_id) REFERENCES boards(id)
);

INSERT INTO lists (board_id, list_name)
VALUES
  (1, 'To Do'),
  (1, 'In Progress'),
  (2, 'Tasks'),
  (3, 'Urgent')
;
```