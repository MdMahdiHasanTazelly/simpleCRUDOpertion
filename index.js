const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");

const express = require('express');
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const { cpSync } = require('fs');
app.use(methodOverride("_method"));

const { v4: uuidv4 } = require('uuid');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({extended:true}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'tazelly',
});


app.listen(port, ()=>{
  console.log(`Listening on port ${port}`);


});



app.get("/", (req, res)=>{
  let q = `SELECT COUNT(*) FROM user;`;

  try{
    connection.query(q, (err, result)=>{
      if(err) throw err;

      let count = result[0]["COUNT(*)"];
      res.render("Home", {count});
      
    });
  }catch(err){
    res.send("Error in DB");
    console.log(err);
  }
  
});



app.get("/user", (req, res)=>{
  try{
    let q = "SELECT * FROM user;";
    connection.query(q, (err, result)=>{
      if(err) throw err;
      let users = result
      res.render("User", {users});

    });
  }catch(err){
    res.send(`Error in Database`);
    console.log(err);
  }
});

//EDIT user
app.get("/user/:id/edit", (req, res)=>{
  let {id} = req.params;

  
  try{
    let q = `SELECT * FROM user WHERE id="${id}"`;
    connection.query(q, (err, result)=>{
      if(err) throw err;
      let user = result[0];
      res.render("edit", {user});
      
    });
    
  }catch(err){
    console.log(err);
    res.send("Error in Database");
  }
 
});


app.patch("/user/:id", (req, res)=>{
  let {id} = req.params;
  let password = req.body.password;
  let newName = req.body.username;

  try{
    let q = `SELECT * FROM user WHERE id="${id}"`;
    connection.query(q, (err, user)=>{
      if(err) throw err;
      let pass = user[0]["password"];

      if(pass !== password){
        res.send("WRONG pasword"); 
       // res.redirect(`http://localhost:8080/user/${id}/edit`);
      }else{
        
        let q2 = `UPDATE user SET username="${newName}" WHERE id="${id}"`;

        try{
          connection.query(q2, (err, result)=>{
          console.log(result);
          res.redirect("/user");
          });
        }catch(err){
          console.log(err);
          res.send(`DB error`);
        }
      }
    });
  }catch(err){
    console.log(err);
    res.send("Error in Database");
  }

});


//ADD new user
app.get("/user/newUser", (req, res)=>{
  res.render("newUser");
});

app.post("/user/newUser", (req, res)=>{
  let{email, username, password} =req.body;

  let id = uuidv4();

  let q = `INSERT INTO user (id, username, email, password) VALUES ("${id}", "${username}", "${email}", "${password}")`;

  connection.query(q, (err, result)=>{
    if(err) throw err;
    res.redirect("/user");
  });
});


//DELETE user
app.delete("/user/:id", (req, res)=>{
  let {id} = req.params;
  let q= `DELETE FROM user WHERE id="${id}"`;

try{
  connection.query(q, (err, result)=>{
    if(err) throw err;
    res.redirect("/user");
  });
}catch(err){
  console.log(err);
  res.send("DB error");
}
});









// let q= "INSERT INTO user (id, username, email, password) VALUES ?";

// let getRandomUser= ()=> {
//   return [
//     faker.string.uuid(),
//     faker.internet.userName(),
//     faker.internet.email(),
//     faker.internet.password()
//   ];
// };
// let data= [];

// for(let i=1; i<=100; i++){
//   data.push(getRandomUser());
// }



// try{
//   connection.query(q, [data], (err, result)=>{
//     if(err) throw err;
//     console.log(result);
//   });
// }catch(err){
//   console.log(err);
// }

// connection.end();



// console.log(getRandomUser());