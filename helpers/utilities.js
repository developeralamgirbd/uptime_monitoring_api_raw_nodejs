/**
 * Title: Utilities errors
 * Description: Important utility function
 * Author: Alamgir Hossen
 * Date: 29-09-2022
 */

// dependencies
const crypto = require('crypto');
const environment = require('./environments');
// module scaffolding
const utilities = {};

//parse JSON string to Object
utilities.parseJSON = (jsonString)=>{
    let output;

    try {
        output = JSON.parse(jsonString)
    }catch (e){
        output = {}
    }

    return output;
}

//hash string
utilities.hash = (password)=>{
    if (typeof password === 'string' && password.length > 0){
        const hash = crypto.createHmac("sha256", environment.secretKey)
            .update(password)
            .digest('hex');
        return hash;
    }else {
        return false
    }
}

// create random string
utilities.createRandomString = (strLength)=>{
    let length = strLength;
    length = typeof strLength === 'number' && strLength > 0 ? strLength : false;
    if (length){
        let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';
        let output = '';

        for (let i = 1; i <= length; i++){
            let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            output += randomCharacter;
        }
        return output;
    }else {
        return false;
    }
}


// export module
module.exports = utilities;