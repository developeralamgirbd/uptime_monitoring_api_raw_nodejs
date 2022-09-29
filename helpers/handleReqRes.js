/**
 * Title: Handle Request Response
 * Description: Handle Request and Response
 * Author: Alamgir Hossen
 * Date: 27-09-2022
 */

// dependencies
const url = require("url");
const {StringDecoder} = require("string_decoder");
const routes = require('../routes')
const {notFoundHandler} = require('../handlers/routesHandlers/notFoundHandlers');
const {parseJSON} = require('./utilities');
// module scaffolding
const handler = {};

handler.handleReqRes = (req, res)=>{
    // request handling
    // get the url and parse it
    const parseUrl = url.parse(req.url, true);
    const pathname = parseUrl.pathname;
    const trimmedPath = pathname.replace(/^\/+|\/+$/g,'');
    const method = req.method.toLowerCase();
    const queryStringObj = parseUrl.query;
    const headers = req.headers;

    const requestProperties = {
        parseUrl,
        pathname,
        trimmedPath,
        method,
        queryStringObj,
        headers
    }

    const decoder = new StringDecoder('utf-8');
    let realData = '';

    let chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;


    req.on('data', (buffer)=>{
        realData += decoder.write(buffer)
    })
    req.on('end', ()=>{
        realData += decoder.end();

        requestProperties.body = parseJSON(realData);

        chosenHandler(requestProperties, (statusCode, payload)=>{
            statusCode  = typeof statusCode === 'number' ? statusCode : 500;
            payload     = typeof payload === 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);

            // return the final response
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    })

}

module.exports = handler;