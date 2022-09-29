/**
 * Title: Routes
 * Description: Application Routes
 * Author: Alamgir Hossen
 * Date: 27-09-2022
 */

// dependencies
const {sampleHandler}    = require('./handlers/routesHandlers/simpleHandlers')
const {userHandler}      = require('./handlers/routesHandlers/userHandlers')
const {tokenHandler}     = require('./handlers/routesHandlers/tokenHandler');
const routes = {
    'sample': sampleHandler,
    'user': userHandler,
    'token': tokenHandler
}

module.exports = routes;