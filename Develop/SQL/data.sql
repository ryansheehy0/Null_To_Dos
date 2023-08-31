-- Probably have ot encrypt the names

insert into users (email, hashed_password)
values ('ryansheehy0@gmail.com', '$2b$07$i7vcjUJXJbczMVmbiJiQBOHEtZHk/N93Sh1H862iC9iKxVqIveihG');

insert into boards (name, previous_board_id, user_email)
values
  ('Programming', null, 'ryansheehy0@gmail.com'),
  ('Todos', 1, 'ryansheehy0@gmail.com');

insert into lists (name, previous_list_id, board_id)
values
  ('Programming languages', null, 1),
  ('Cheatsheets', 1, 2);

insert into cards (name, previous_card_id, parent_card_id, list_id)
values
  ('HTML/CSS/JS', null, null, 1),
    ('NodeJS', null, 1, 1),
      ('Express', null, 2, 1),
      ('mysql2', 3, 2, 1),
        ('SQL', null, 4, 1),
      ('bcrypt', 4, 2, 1),
    ('React/Next', 2, 1, 1),
    ('React Native', 7, 1, 1),
    ('Electron', 8, 1, 1),
  ('Android', 1, null, 1),
    ('Java', null, 10, 1),
    ('Kotlin', 11, 10, 1),
  ('C/C++', 10, null, 1),

  ('Android Studio', null, null, 2),
  ('Tailwind', 14, null, 2),
  ('React', 15, null, 2);