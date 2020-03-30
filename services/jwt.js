'user strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const key = 'claver super secreta';

exports.createToken = (systemUser) => {
    var payload = {
        sub:systemUser.idsystemUser,
        name: systemUser.name, 
        lastName: systemUser.lastName,
        email: systemUser.email,
        password: systemUser.password,
        lat: moment().unix(),
        exp: moment().add(6,'hours').unix()
    }
    return jwt.encode(payload,key);
}
