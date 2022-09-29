/**
 * Title: Token Handler
 * Description: Handler to handle token related routes
 * Author: Alamgir Hossen
 * Date: 29-09-2022
 */

// dependencies
const data = require('../../lib/data');
const {hash} = require('../../helpers/utilities');
const {parseJSON} = require('../../helpers/utilities');

const {createRandomString} = require('../../helpers/utilities');

// module scaffolding
const handlers = {};

handlers.tokenHandler = (requestProperties, callback)=>{
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1){
        handlers._token[requestProperties.method](requestProperties, callback);
    }else {
        callback(405);
    }
}

handlers._token = {};

handlers._token.post = (requestProperties, callback)=>{
    const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11
        ? requestProperties.body.phone
        : false;
    const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password > 0
        ? requestProperties.body.password
        : false;
    if (phone && password){
        data.read('users', phone, (err1, userData)=>{
            let hashedPassword = hash(password);
            if (hashedPassword === parseJSON(userData).password){
                let tokenId = createRandomString(20);
                let expires = Date.now() + 60 * 60 * 1000;
                let tokenObject = {
                    phone,
                    id: tokenId,
                    expires
                };

                // store the token
                data.create('tokens', tokenId, tokenObject, (err2)=>{
                    if (!err2){
                        callback(200, tokenObject)
                    }else {
                        callback(500, {
                            error: 'There was a problem in the server side'
                        })
                    }
                })
            }else {
                callback(400, {
                    error: 'Password is not valid!'
                })
            }
        })
    }else {
        callback(400, {
            error: 'You have a problem in your request'
        })
    }

}

handlers._token.get = (requestProperties, callback)=>{
    // check the id number if valid
    const id = typeof requestProperties.queryStringObj.id === "string"
    && requestProperties.queryStringObj.id.trim().length === 20
        ? requestProperties.queryStringObj.id
        : false;

    if (id){
        // lookup the token
        data.read('tokens', id, (err, tokenData)=>{
            const token = {...parseJSON(tokenData)}
            if (!err && token){
                callback(200, token)
            }else {
                callback(404, {
                    error: 'Token not found'
                })
            }
        })
    }else {
        callback(404, {
            error: 'Token not found'
        })
    }
}

handlers._token.put = (requestProperties, callback)=>{
// check the id number if valid
    const id = typeof requestProperties.body.id === "string"
        && requestProperties.body.id.trim().length === 20
        ? requestProperties.body.id
        : false;
    const extend = typeof requestProperties.body.extend === "boolean" && requestProperties.body.extend === true;
    if (id && extend){
        data.read('tokens', id, (err1, tokenData)=>{
            if (!err1){
                let tokenObj = parseJSON(tokenData);
                if (tokenObj.expires > Date.now()){
                    tokenObj.expires = Date.now() + 60 * 60 * 1000;
                    // store the updated token
                    data.update('tokens', id, tokenObj, (err2)=>{
                        if (!err2){
                            callback(200, {
                                message: 'Token updated successfully'
                            })
                        }else {
                            callback(500, {
                                error: 'There was a server side problem!'
                            })
                        }
                    })
                }else {
                    callback(400, {
                        error: 'Token already  expired!'
                    })
                }
            }else {
                callback(400, {
                    error: 'There was a problem in your request!'
                })
            }


        })
    }else {
        callback(400, {
            error: 'There was a problem in your request3!'
        })
    }
}

handlers._token.delete = (requestProperties, callback)=>{
    // check the token if valid
    const id = typeof requestProperties.queryStringObj.id === "string"
    && requestProperties.queryStringObj.id.trim().length === 20
        ? requestProperties.queryStringObj.id
        : false;
    if (id){
        data.delete('tokens', id, (err2)=>{
            if (!err2){
                callback(200, {
                    message: 'Token was deleted successfully'
                })
            }else {
                callback(400, {
                    error: 'Invalid token id. please try again!'
                })
            }
        })

    }else {
        callback(400, {
            error: 'Invalid token id. please try again!'
        })
    }
}

handlers._token.verify = (id, phone, callback)=>{
    data.read('tokens', id, (error,tokenData)=>{
        if (!error && tokenData){
            if (parseJSON(tokenData).phone === phone && parseJSON(tokenData).expires > Date.now()){
                callback(true)
            }else {
                callback(false)
            }
        }else {
            callback(false)
        }
    })
}

module.exports = handlers;