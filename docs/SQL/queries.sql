-- JS Functions
/*
function findNextElement(id, results){
  for(let i = 0; i < results.length; i++){
    const result = results[i]
    if(result.previous_id === id){
      const output = {...result} // Pass by value
      delete output.previous_id
      return output
    }
  }
  return null
}
*/




  -- SQL get array of user's boards. Input is user's email
select id, name, previous_board_id as previous_id from boards
join users on users.email = boards.user_email
where users.email = 'ryansheehy0@gmail.com';
  -- Set order with JS
/*
  const [results, ] = await db.query(SQL)
  let orderedResults = []

  let firstElement = findNextElement(null, results)

  if(firstElement === null) return [] // If no first element

  orderedResults.push(firstElement)

  let nextElement = findNextElement(firstElement.id, results)
  while(nextElement !== null){
    orderedResults.push(nextElement)
    nextElement = findNextElement(firstElement.id, results)
  }

  return orderedResults
*/

  -- Output: [{id, name}, {id, name}]

  -- SQL get array of board's lists. Input is board's id
select lists.id, lists.name, previous_list_id from lists
join boards on boards.id = lists.board_id
where boards.id = 1;
  -- Set order with JS
  -- Output: [{id, name}, {id, name}]

  -- SQL get array of list's cards. Input is lists's id
select cards.id, cards.name, previous_card_id, parent_card_id from cards
join lists on lists.id = cards.list_id
where lists.id = 1;
  -- Set order and hierarchy with JS
/*
*/

  -- Output: {id, name, [{id, name}, {id, name}]}