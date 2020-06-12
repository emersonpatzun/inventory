'user strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const key = 'clave super secreta';   

//constants
const CONSTANTS = require('../constants/messagesAuthentication');

exports.ensureAuth = (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(403).send({message: CONSTANTS.UNAUTHORIZED_REQUEST});
    } else {
        var token = req.headers.authorization.replace(/["']+/g,'');
        try {
            var payload = jwt.decode(token, key);
            if(payload.exp <= moment().unix()){
                return res.send({message: CONSTANTS.EXPIRED_TOKEND});
            }
        } catch (error) {
            console.log(error);
        }
        req.systemUser = payload;
        next();
    }
}

exports.ensureAuthLogin = (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(403).send({message: CONSTANTS.UNAUTHORIZED_REQUEST});
    } else {
        var token = req.headers.authorization.replace(/[""]+/g,'');
        try{
            var payload = jwt.decode(token,key);
            if(payload.exp <= moment().unix()){
                return res.send({message: CONSTANTS.EXPIRED_TOKEND});
            } else if(payload.role != Response(ADMIN)) {
                return res.status(403).send({message: CONSTANTS.ACCESS_DENIED});
            } 
        } catch(error){
            console.log(error);
            return res.status(418).send({message: CONTANTS.INVALID_TOKEN});
        }
    }
    req.systemUser = payload;
    next();
}
