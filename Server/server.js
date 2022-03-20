const UserHandler = require('./Logic/UserHandler.js');
const express = require('express');
const cors = require("cors");

const PORT = 5555;
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors());
let handler;

const isUnauthorised = (token) => {
    const user = handler.findUser(token);
    return user === null || user.isLoggedIn === false;
}


app.listen(PORT, () => {
    handler = new UserHandler();
    console.log("Server oppened at " + PORT);
});

app.post("/register", (req, res) => {
    console.log(`register: Data received: ${req.body}`);
    const result = handler.addUser(req.body.username, req.body.password);
    if(result === null) {
        res.status(400).json({message: result.message}).send();
    }
    else{
        res.status(200).json({token: result.user.token}).send();
    }
})

app.post("/logout", (req, res) => {
    console.log(`logout: Data received: ${req.body}`);
    if(handler.logoutUser(reg.body.token) ===  true) {
        res.status(200).send();
    } else {
        res.status(400).send();
    }
})

app.post("/login", (req, res) => {
    console.log(`login: Data received: ${req.body}`);
    const result = handler.loginUser(req.body.username, req.body.password);
    if(result === null) {
        res.status(400).send();
    } else {
        res.status(200).json({token: result}).send();
    }
})

app.post("/enter", (req, res) => {
    if(isUnauthorised(req.body.token) === true) {
        console.log('Unauthorized request');
        res.status(401).send();
    } else {
        console.log(req.body);
        console.log(`enter: Data received: ${req.body.token}`);
        if(req.body.token === null) {
            res.status(400).send();
        }
        else {
            const data = [];
            handler.activities.forEach(element => {
                data.push(element);
            });
            res.status(200).send({activity: data})
        }
    }
});

app.post("/modify_data", (req, res) => {
    if(isUnauthorised(req.body.token) === true) {
        console.log('Unauthorized request');
        res.status(401).send();
    } else {
        if(req.body.token === null ||
            req.body.time === null ||
            req.body.date === null ||
            req.body.code === null ||
            req.body.description === null ||
            req.body.id === null) {
            res.status(400).send();
        }
        const user = handler.findUser(req.body.token);
        let status = false;
        handler.files.forEach(data => {
            if(data.name === user.username) {
                if(data.tryRemove(req.body.id) === true) {
                    status = true;
                }
            }
        });
        if(status === true)  {
            handler.addEntire(req.body);
            res.status(200).send();
        } else {
            res.status(400).send(); 
        }
    }
});

app.post("/fetch_data", (req, res) => {
    if(isUnauthorised(req.body.token) === true) {
        console.log('Unauthorized request');
        res.status(401).send();
    } else {
        const user = handler.findUser(req.body.token);
        let status = false;
        handler.files.forEach(data => {
            if(data.name === user.username) {
                data.entires.forEach(entry => {
                    if(entry.ID === req.body.id) {
                        console.log(entry);
                        res.status(200).send(entry);
                    }
                });
            }
        });
        res.status(400).send();
    }
})

app.post("/enter_data", (req, res) => {
    if(isUnauthorised(req.body.token) === true) {
        console.log('Unauthorized request');
        res.status(401).send();
    } else {
        if(req.body.token === null ||
            req.body.time === null ||
            req.body.date === null ||
            req.body.code === null ||
            req.body.description === null) {
            res.status(400).send();
        } 
        handler.addEntire(req.body);
        res.status(200).send();
    }
});


app.post("/home_data", (req, res) => {
    if(isUnauthorised(req.body.token) === true) {
        console.log('Unauthorized request');
        res.status(401).send();
    } else {
        console.log("/home");
        const date = new Date(req.body.date);
        const result = handler.findFile(req.body.token, date.getFullYear(), date.getMonth() + 1);
        if(result === null) {
            res.status(200).send({entries: []});
        } else {
            const output = [];
            result.entires.forEach(data => {
                if(data.date === req.body.date) {
                    output.push(data);
                }
            });
            res.status(200).send({entries: output});
        }
    }
})

app.post("/work_time", (req, res) => {
    if(isUnauthorised(req.body.token) === true) {
        console.log('Unauthorized request');
        res.status(401).send();
    } else {
        console.log("/work_time");
        const user = handler.findUser(req.body.token);
        if(user === null) {
            res.status(400).send();
        } else {
            let totalTime = 0;
            handler.files.forEach((data) => {
                if(data.checkUsername(user.username) === true) {
                    data.entires.forEach((entry) => {
                        totalTime = entry.time + totalTime;
                    });
                }
            });
            res.status(200).send({time: totalTime});
        }
    }
})

app.delete("/delete", (req, res) => {
    if(isUnauthorised(req.body.token) === true) {
        console.log('Unauthorized request');
        res.status(401).send();
    } else {
        const user = handler.findUser(req.body.token);
        if(user === null) {
            res.status(401).send();
        } else {
            console.log(req.body.id);
            handler.files.forEach(data => {
                if(data.name === user.username) {
                    if(data.tryRemove(parseInt(req.body.id)) === true) {
                        res.status(200).send();
                        return;
                    }
                }
            });
            res.status(400).send();
        }
    }
});