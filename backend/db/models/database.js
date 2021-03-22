const sqlite = require('sqlite3')
const path = require('path')
const readline = require('readline')
const dbPath = path.resolve(__dirname, 'tables.db')

//open database
function openDB(){
    let db = new sqlite.Database(dbPath, sqlite.OPEN_READWRITE, (err) =>{
        if(err){
            console.error(err.message)
        }
        else{
            console.log('Connected to the tables database.')
        }
    })
    return db
}

//create Board in database
function newBoard(title){
    let db = openDB()
    db.serialize(function(){
        db.run("INSERT INTO Boards (title) VALUES ('"+title+"')", (err)=>{
            if(err){
                console.error(err.message)
            }
            else{
                console.log('Inserted into table Boards')
            }
        })
    })

    db.close()
}

//edit Board in database
function editBoard(oldName, newName){ //change needed: update query so that only authorized users can make changes
    let db = openDB()
    db.serialize(function(){
        db.run("UPDATE Boards SET title = '"+newName+"' WHERE title = '"+oldName+"'", (err)=>{
            if(err){
                console.error(err.message)
            }
            else{
                console.log('Board '+oldName+' renamed into '+newName+'.')
            }
        })
    })

    db.close()
}

//delete Board in database
function deleteBoard(title){ //change needed: update query so that only authorized users can make changes
    let db = openDB()
    db.serialize(function(){
        db.run("DELETE FROM Boards WHERE title = '"+title+"'", (err)=>{
            if(err){
                console.error(err.message)
            }
            else{
                console.log('Board '+title+' has been deleted.')
            }
        })
    })

    db.close()
}