drop if exists null_todos;
create database null_todos;

use null_todos;

create table users (
  email varchar(255) not null primary key,
  hashed_password varchar(255) not null
);

-- To set the order of elements you
  -- 1. Get all of that element. Ex: all boards belonging to the user
  -- 2. Find the element who's previous_element_id equals null
  -- 3. Get that element's id
  -- 4. Find the element who's previous_element_id equals the id you just got
  -- 5. Repeat until you can't end of your list of elements

create table boards (
  id int unsigned not null primary key auto_increment,
  name varchar(255) not null,
  previous_board_id int unsigned,
  foreign key (previous_board_id) references boards(id),
  user_email varchar(255) not null,
  foreign key (user_email) references users(email)
);

create table lists (
  id int unsigned not null primary key auto_increment,
  name varchar(255) not null,
  previous_list_id int unsigned,
  foreign key (previous_list_id) references lists(previous_list_id),
  board_id int unsigned not null,
  foreign key (board_id) references boards(id)
);

create table cards (
  id int unsigned not null primary key auto_increment,
  name var(255) not null,
  previous_card_id int unsigned,
  foreign key (previous_card_id) references cards(id),
  parent_card_id int unsigned,
  foreign key (parent_card_id) references cards(id),
  list_id int unsigned not null,
  foreign key (list_id) references lists(id)
);