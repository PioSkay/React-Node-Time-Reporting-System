const crypto = require('crypto');

class User {
    constructor(username, password)
    {
        this.username = username;
        this.password = password;
        this.isLoggedIn = false;
        this.token = crypto.createHash('sha1').update(username).digest('hex');
    }
    checkToken(token) {
        return token === this.token;
    }
    login()
    {
        this.isLoggedIn = true;
    }
    logout()
    {
        this.isLoggedIn = false;
    }
}

module.exports = User;