/**
 * Title: User Handler
 * Description: Handler to handle user related routes
 * Author: Alamgir Hossen
 * Date: 29-09-2022
 */

// dependencies
const data = require('../../lib/data');
const {hash} = require('../../helpers/utilities');
const {parseJSON} = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');
// module scaffolding
const handlers = {};

handlers.userHandler = (requestProperties, callback)=>{
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1){
        handlers._user[requestProperties.method](requestProperties, callback);
    }else {
        callback(405);
    }
}

handlers._user = {};

handlers._user.post = (requestProperties, callback)=>{
    const firstName = typeof requestProperties.body.firstName === "string"
        && requestProperties.body.firstName.trim().length > 0
        ? requestProperties.body.firstName
        : false;

    const lastName = typeof requestProperties.body.lastName === "string"
    && requestProperties.body.lastName.trim().length > 0
        ? requestProperties.body.lastName
        : false;

    const phone = typeof requestProperties.body.phone === "string"
    && requestProperties.body.phone.trim().length === 11
        ? requestProperties.body.phone
        : false;

    const password = typeof requestProperties.body.password === "string"
    && requestProperties.body.password.trim().length > 0
        ? requestProperties.body.password
        : false;

    const tosAgreement = typeof requestProperties.body.tosAgreement === "boolean"
        ? requestProperties.body.tosAgreement
        : false;


    if (firstName && lastName && phone && password && tosAgreement){
        // make sure that the user doesn't already exist
        data.read('users', phone, (err1, user)=>{
            if (err1){
                let userObj = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement
                };
                // store the user to db
                data.create('users',phone,userObj, (err2)=>{
                    if (!err2){
                        callback(200, {
                            message: 'User created successfully'
                        })
                    }else {
                        callback(500, {
                            error: 'Could not create user'
                        })
                    }
                })

            }else {
                // already user exist
                callback(500, {
                    error: 'User already exist'
                })
            }
        })
    }else {
        callback(400, {
            error: 'You have a problem in your request'
        })
    }
}

handlers._user.get = (requestProperties, callback)=>{
    // check the phone number if valid
    const phone = typeof requestProperties.queryStringObj.phone === "string"
    && requestProperties.queryStringObj.phone.trim().length === 11
        ? requestProperties.queryStringObj.phone
        : false;

    if (phone){
        //verify token
        let token = typeof requestProperties.headers.token === 'string' ? requestProperties.headers.token : false;
        tokenHandler._token.verify(token, phone, (tokenId)=>{
            if (tokenId){
                // lookup the user
                data.read('users', phone, (err, u)=>{
                    const user = {...parseJSON(u)}
                    if (!err && user){
                        delete user.password;
                        callback(200, user)
                    }else {
                        callback(404, {
                            error: 'User not found'
                        })
                    }
                })
            }else {
                callback(403, {
                    error: 'Authentication failed'
                })
            }
        })


    }else {
        callback(404, {
            error: 'User not found'
        })
    }
}

handlers._user.put = (requestProperties, callback)=>{

    const firstName = typeof requestProperties.body.firstName === "string"
    && requestProperties.body.firstName.trim().length > 0
        ? requestProperties.body.firstName
        : false;

    const lastName = typeof requestProperties.body.lastName === "string"
    && requestProperties.body.lastName.trim().length > 0
        ? requestProperties.body.lastName
        : false;

    const phone = typeof requestProperties.queryStringObj.phone === "string"
    && requestProperties.queryStringObj.phone.trim().length === 11
        ? requestProperties.queryStringObj.phone
        : false;

    const password = typeof requestProperties.body.password === "string"
    && requestProperties.body.password.trim().length > 0
        ? requestProperties.body.password
        : false;

    if (phone){
        //verify token
        let token = typeof requestProperties.headers.token === 'string' ? requestProperties.headers.token : false;
        tokenHandler._token.verify(token, phone, (tokenId)=>{
            if (tokenId){
                if (firstName || lastName || password){
                    // lookup the user
                    data.read('users', phone, (err1, uData)=>{
                        const userData = {...parseJSON(uData)};
                        if (!err1 && userData){
                            if (firstName){
                                userData.firstName = firstName;
                            }
                            if (lastName){
                                userData.lastName = lastName;
                            }
                            if (password){
                                userData.password = hash(password);
                            }

                            // Update to database
                            data.update('users', phone, userData, (err2)=>{
                                if (!err2){
                                    callback(200, {
                                        message: 'User was updated successfully'
                                    })
                                }else {
                                    callback(500, {
                                        error: 'There was a problem in the server side',
                                    })
                                }
                            })

                        }else {
                            callback(400, {
                                error: 'You have a problem in your request!',
                            })
                        }
                    })
                }else {
                    callback(400, {
                        error: 'You have a problem in your request!',
                    })
                }
            }else {
                callback(403, {
                    error: 'Authentication failed'
                })
            }
        })



    }else {
        callback(400, {
            error: 'Invalid phone number. Please try again!',
        })
    }
}

handlers._user.delete = (requestProperties, callback)=>{
    // check the phone number if valid
    const phone = typeof requestProperties.queryStringObj.phone === "string"
    && requestProperties.queryStringObj.phone.trim().length === 11
        ? requestProperties.queryStringObj.phone
        : false;
    if (phone){
        //verify token
        let token = typeof requestProperties.headers.token === 'string' ? requestProperties.headers.token : false;
        tokenHandler._token.verify(token, phone, (tokenId)=>{
            if (tokenId){
                data.delete('users', phone, (err2)=>{
                    if (!err2){
                        callback(200, {
                            message: 'User was deleted successfully'
                        })
                    }else {
                        callback(400, {
                            error: 'Invalid phone number. please try again!'
                        })
                    }
                })
            }else {
                callback(403, {
                    error: 'Authentication failed'
                })
            }
        })



    }else {
        callback(400, {
            error: 'Invalid phone number. please try again!'
        })
    }
}

module.exports = handlers;

//verify token
/*let token = typeof requestProperties.headers.token === 'string' ? requestProperties.headers.token : false;
tokenHandler._token.verify(token, phone, (tokenId)=>{
    if (tokenId){

    }else {
        callback(403, {
            error: 'Authentication failed'
        })
    }
})*/


