const express = require('express');
const app = express();


const bodyParser = require('body-parser');
const PORT = 8000;
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const fetch = (url) => import('node-fetch').then(({ default: fetch }) => fetch(url));

app.get("/todo", (req, res) => {

    fetch("https://jsonplaceholder.typicode.com/todos")    //fetching todo list
        .then(res => res.json())
        .then((data) => {
            const udata = data.map(u => ({ id: u.id, title: u.title, completed: u.completed }));   //taking required items
            res.send(udata);
        })
        .catch(err => { res.send("error") });
})


app.get('/user/:id', (req, res) => {
    const { id } = req.params;
    const url = "https://jsonplaceholder.typicode.com/users/" + id;
    fetch(url)                                                               //fetching user data
        .then(res => res.json())
        .then((user) => {
            fetch("https://jsonplaceholder.typicode.com/todos")
                .then(res => res.json())
                .then((data) => {
                    let todos = [];
                    for (let todo of data) {
                        if (Number(id) === Number(todo.userId))             //taking todo list item whose id matches userId
                        {
                            todos.push(todo);
                        }
                    }
                    let userInfo = [];
                    userInfo.push(user);   //pushing user details
                    userInfo.push(todos);  //pushing user todolist
                    res.send(userInfo);
                })
                .catch(err => { res.send("error") });

        })
        .catch(err => { res.send("error") });
})


app.listen(PORT, () => {
    console.log("server is running on", PORT)
})