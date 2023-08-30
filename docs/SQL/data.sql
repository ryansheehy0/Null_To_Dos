insert into users (email, hashed_password)
values ('ryansheehy0@gmail.com', '$2b$07$i7vcjUJXJbczMVmbiJiQBOHEtZHk/N93Sh1H862iC9iKxVqIveihG');

insert into boards (name, previous_board_id, user_email)
values
  ('Programming', null, 'ryansheehy0@gmail.com'),
  ('Todos', 1, 'ryansheehy0@gmail.com');

insert into lists (name, previous_list_id, board_id)
values
  ('Programming languages', null, 1),
  ('Projects', 1, 1),
  ('Todo', null, 2),
  ('Cheatsheets', 1, 2);

insert into cards (name, previous_card_id, parent_card_id, list_id)
values
1 ('HTML/CSS/JS', null, null, 1),
2   ('NodeJS', null, 1, 1),
3     ('Express', null, 2, 1),
4     ('mysql2', 3, 2, 1),
5       ('SQL', null, 4, 1),
6     ('bcrypt', 4, 2, 1),
7   ('React/Next', 2, 1, 1),
8   ('React Native', 7, 1, 1),
9   ('Electron', 8, 1, 1),
10 ()
