'user strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const key = 'clave super secreta';
const Utilities = require('../util/const.util');   

exports.ensureAuth = (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(403).send({message:'unauthorized request'});
    } else {
        var token = req.headers.authorization.replace(/["']+/g,'');
        try {
            var payload = jwt.decode(token, key);
            if(payload.exp <= moment().unix()){
                return res.send({message:'expired tokend'});
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
        return res.status(403).send({message:'unauthorized request'})
    } else {
        var token = req.headers.authorization.replace(/["']+/g,'');
        try{
            var payload = jwt.decode(token,key);
            if(payload.exp <= moment().unix()){
                return res.send({message: 'expired tokend'});
            } else if(payload.role !== Utilities.ADMIN) {
                return res.status(403).send({message: 'You are not authorized tho access this resource'});
            } 
        } catch(error){
            console.log(error);
            return res.status(418).send({message: 'invalid tokend'});
        }
    }
    req.systemUser = payload;
    next();
}