const User = require('./User.js');
const fs = require('fs');
const file = require('./File.js');

class UserHandler {
    constructor() {
        this.users = [];
        this.activities = [];
        this.files = [];
        this.usersName = 'users';
        this.viewBackendData = true;
        if(this.initUsers() === false)
        {
            console.log('[WARNING] Could not initialize users!');
        }
        if(this.initActivities() === false)
        {
            console.log('[WARNING] Could not initialize activities!');
        }
        this.initFiles();
    }
    initFiles() 
    {
        this.users.forEach(data => {
            const files = fs.readdirSync('Data/', ).filter(fn => fn.endsWith('.json')).filter(fn => fn.startsWith(data.username + '-'));
            for(let i = 0; i < files.length; i++) {
                let ele = files[i];
                if(ele !== null)
                {
                    ele = ele.replace(data.username + '-', '');
                    ele = ele.replace('.json', '');
                    ele = ele.split('-');
                    this.files.push(new file(data.username, parseInt(ele[0]), parseInt(ele[1])));
                }
            }
        });
    }
    initUsers()
    {
        let jsonString = null;
        try {
            jsonString = fs.readFileSync(`Data/${this.usersName}.json`, "utf-8");
        }
        catch(err)
        {
            console.log(`[FATAL]${err}`);
            return false;
        }
        if(jsonString == null)
            return false;
        const us = JSON.parse(jsonString);
        us.users.forEach(data => {
            this.users.push(new User(data.username, data.password));
        });
        if(this.viewBackendData === true)
        {
            console.log(`Users: \n ${JSON.stringify(this.users)}`);
        }
        return true;    
    }
    initActivities()
    {
        let jsonString = null;
        try {
            jsonString = fs.readFileSync(`Data/activity.json`, "utf-8");
        }
        catch(err)
        {
            console.log(`[FATAL]${err}`);
            return false;
        }
        if(jsonString == null)
            return false;
        const us = JSON.parse(jsonString);
        us.activities.forEach(data => {
            this.activities.push({
                code: data.code,
                manager: data.manager,
                name: data.name,
                budget: data.budget
            });
        });
        if(this.viewBackendData === true)
        {
            console.log(`Activities: \n ${JSON.stringify(this.activities)}`);
        }
    }
    addUser(username, password)
    {
        let output = null;
        this.users.forEach(data => {
            if(data.username === username)
            {
                output = {
                    status: false,
                    message: 'User already exists',
                    user: new User('', '')
                }
            }
        });
        if(output != null)
            return output;
        this.users.push(new User(username, password));
        this.users[this.users.length - 1].login();
        this.saveUsers();
        return {
            status: true,
            message: 'OK',
            user: this.users[this.users.length - 1]
        }
    }
    loginUser(username, password)
    {
        let token = null;
        this.users.forEach(data => {
            if(data.username == username && data.password == password)
            {
                data.login();
                token = data.token;
            }
        });
        return token;
    }
    logoutUser(token)
    {
        let result = false;
        this.users.forEach(data => {
            if(data.token == token)
            {
                data.logout();
                result = true;
            }
        });
        return result;
    }
    findUser(token)
    {
        let response = null;
        this.users.forEach(data => {
            if(data.checkToken(token) === true)
            {
                response = data;
            }
        });
        return response;
    }
    findFile(token, year, month)
    {
        console.log(token, year, month);
        const user = this.findUser(token);
        if(user === null || user.isLoggedIn === false) {
            return null;
        } else {
            let response = null;
            this.files.forEach(data => {
                if(data.checkDate(user.username, year, month) === true) {
                    response = data;
                }
            });
            return response;
        }
    }
    addEntire(element)
    {
        const status = false;
        const user = this.findUser(element.token);
        const dateObj = new Date(element.date);
        if(user !== null && user.isLoggedIn === true)
        {
            let fileFound = false;
            this.files.forEach(data => {
                if(data.checkDate(user.username, dateObj.getFullYear(), dateObj.getMonth() + 1) === true) {
                    fileFound = true;
                }
                const result = data.tryAdd(user.username, dateObj.getFullYear(), dateObj.getMonth() + 1, element);
                if(result === true) {
                    return true;
                }
            });
            if(fileFound === false) {
                this.files.push(new file(user.username, dateObj.getFullYear(), dateObj.getMonth() + 1, false));
                this.files[this.files.length - 1].tryAdd(user.username, dateObj.getFullYear(), dateObj.getMonth() + 1, element);
            }
            return true;
        } else {
            return false;
        }
    }
    saveUsers()
    {
        const locUsers = { users: [] };
        this.users.forEach(data => {
            locUsers.users.push({
                username: data.username,
                password: data.password
            });
        });
        const jsonData = JSON.stringify(locUsers, null, "\t");
        fs.writeFileSync(`Data/${this.usersName}.json`, jsonData);
    }
}

module.exports = UserHandler;