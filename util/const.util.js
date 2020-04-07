'use strict'

//STATES
const ACTIVE = "ACTIVE";
const INACTIVE = "INACTIVE";
// ROLES
const USER = "USER";
const ADMIN = "ADMIN";
// password has a blank space
const BLANKSPACE  = /^.+\s.*$/g;

module.exports {
    ACTIVE,
    INACTIVE,
    USER,
    ADMIN,
    BLANKSPACE
}