'use strcit'
// modules 
const BCrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

//modeles
const User = require('../models/System_user');

async function createUser(req, res) {
    let data = req.body;
    let user = new User();


    if(data.name && data.lastName && data.userName && data.email &&
        data.password && data.state) {

            if((data.password). length <= 7) {
                res.status(400).send({message:'Password must be greater than or equal to 8 characters'});
            } else {
                try {
                    let userExists = await User.find({$or:[{userName:data.userName},{email:data.email},
                                                     {role: data.role}]});

                    if(userExists) res.status(400).send({message:'User already exists'});
                    else {
                        user.name = data.name;
                        user.lastName = data.lastName;
                        user.userName = data.userName;
                        user.email = data.email;
                        user.state = data.state;

                        var password = await BCrypt.hash(data.password, null, null);
                        if(!password) res.status(500). send({message:'Password creation error.'});
                        else {
                            user.password = password;
                            if(data.role.equals('SELLER')){
                                user.rol = 'SELLER';
                                let userSaved = await user.save();

                                if(!userSaved) res.status(500).send({message:'could not create a user'});
                                else{
                                    scart
                                }
                            } else if(data.role.equals('ADMIN')){
                                user.role ='ADMIN';
                                let adminSaved = await user.save();
                                
                                if(!adminSaved) res.status(500).send({message:'could not create administrator'});
                                else {
                                    res.send(adminSaved);
                                } 
                            }
                        }
                    }
                }catch(err){
                    res.status(500).send('Internal Server Error');
                    console.log(error);
                }
            }
        } else{
            res.status(400).send({message:'All fields are required'});
        }
}

async function editRoleUser(req, res) {
    let idsystemUser =req.params.idsystemUser;
    let role = req.body.role;

    if(role){
        try {
            let userUpdated = await User.findByIdAndUpdate(id,{role:role.toUpperCase()},{new:true});

            if(!userUpdated) res.status(400).send({message:'El usuario ya existe'});
            else{
                res.send(userUpdated);
            }
        }catch(err){
            res.status(500).send('Internal Server Error');
            console.log(error);
        }
    }else {
        res.status(400).send({message:'the role is required'});
    }
}

async function listUsers(req, res) {
    try{
        let users = await User.find({});

        if(!users) res.send({message:'Could not get users'});
        else {
            if(users) res.send({message:'no users available'});
            else {
                res.send(users);
            }
        }
    }catch(err){
        res.status(500).send('Internal Server Error');
        console.log(err);
    }
}

async function addAdmin(req, res) {
    let data = req.body;
    let user = new User();

    if(data.name && data.lastName && data.userName && data.email &&
        data.password && data.state) {

            if((data.password),length <= 7) {
                res.status(400).send({message:'the password must be greater than or equal to 8 characters'});
            }else {
                try {
                    let userExists = await User.find({$os:[{username:data.username}, {email:data.email}]});

                    if(userExists) res.status(400).send({message:'user already exists'});
                    else{
                        user.name = data.name;
                        user.lastName = data.lastName;
                        user.userName = data.userName;
                        user.email = data.email;
                        user.role = 'ADMIN';

                        BCrypt.hash(data.password, null, null, (error, password) => {
                            if(error){
                                res.send(500).send({message: 'Password creation error'});
                                console.log(error);
                            }else {
                                user.password = password;
                                user.save((error,userSaved) => {
                                    if(error){
                                        res.status(500).send({message:'Internal Server Error'});
                                        console.log(error);
                                    }else if (serSaved){
                                        res.send(userSaved);
                                    } else {
                                        res.status(200).send({message:'Please try again later.'});
                                    }
                                });
                            }
                        });
                    }
                }catch(err){
                    res.status(500).send('Internal Server Error');
                    console.log(err);
                }
            }
        }else {
            res.status(400).send({message:'All fields are required'});
        }
}

async function searchUser(req, res){
    let search = req.body.search;
    try {
        let user = await User.find({$or: [{name:{$regex:search,$options:'i'}},
                                          {userNamer:{$regex:search,$options:'i'}},
                                          {email:{$regex:search,$options}},
                                        ]
                                    });
        if(!user) res.send({message:'user could not be found'});
        else{
            res.send(user);
        }
    }catch(err){
        res.status(500).send('Internal Server Error');
        console.log(error);

    }
}

async function lpgin(req, res){
    var params = req.body;

    if(params.userName || paramsms.email){
        if(params.password){
            try {
                let userFound = await User.findOne({$or:[{username:params.username},{email:params.email}]});
                if(!userFound) res.send({message: 'incorrect username or email'});
                else{
                    BCrypt.compare(params.password, userFound.password,(error, checked) => {
                        if(error){
                            res.status(500).send({message:'error'});
                            console.log(error);
                        }else if(checked){
                            if(params.gettoken){
                                res.send({tokend: jwt.createTokend(userFound)});
                            }else {
                                res.send({user:userFound});
                            }
                        }else {
                            res.status(401).send({message:'Incorrect password'});
                        }
                    });
                }
            }catch(err){
                res.status(500).send({message:'Internal Server'});
                console.log(err);
            }
        }else {
            res.status(400).send({message:'Enter the password'});
        }
    }else {
        res.status(400).send({message:'enter username or email'});
    }
}

module.exports = {
    createUser,
    editRoleUser,
    listUsers,
    searchUser,
    addAdmin,
    login
}
