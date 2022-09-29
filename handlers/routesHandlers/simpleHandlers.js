/**
 * Title: Sample Handler
 * Description: Sample Handler
 * Author: Alamgir Hossen
 * Date: 27-09-2022
 */
// module scaffolding
const handlers = {};

handlers.sampleHandler = (requestProperties, callback)=>{
    console.log(requestProperties);
    callback(200, {
        message: 'This is a sample url'
    })
}

module.exports = handlers