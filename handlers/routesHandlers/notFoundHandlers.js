/**
 * Title: Sample Handler
 * Description: Sample Handler
 * Author: Alamgir Hossen
 * Date: 27-09-2022
 */
// module scaffolding
const handlers = {};

handlers.notFoundHandler = (requestProperties, callback)=>{
    console.log(requestProperties);
    callback(404, {
        message: 'Your requested URL was not founded'
    })
}

module.exports = handlers