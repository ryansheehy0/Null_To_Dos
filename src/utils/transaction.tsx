export default async function transact(db, func){
  return new Promise((resolve, reject) => {
    db.transaction("rw", db.cards, db.lists, db.boards, async () => {
      try{
        await func()
        resolve()
      }catch(error){
        reject(error)
      }
    }).catch(reject)
  })
}