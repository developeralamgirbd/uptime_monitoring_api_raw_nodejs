/**
 * Title: Uptime Monitoring Application
 * Description: A RESTFul API to monitor up or downtime of user defined link
 * Author: Alamgir Hossen
 * Date: 27-09-2022
 */

// dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
const data = require('./lib/data');

// app object - module scaffolding
const app = {};

/**
 * @TODO: pore muche debo
 */

/*data.create('test','newFile',{name: 'Alamgir Hossen', mobile: '01884457181'}, (err)=>{
    console.log(err);
})*/

/*data.read('test','newFile', (err, data)=>{
    console.log(err, data);
})*/

/*data.update('test','newFile',{name: 'Programmer Alamgir', occupation: 'programming'}, (err)=>{
    console.log(err);
})*/
/*
data.delete('test','newFile',(err)=>{
    console.log(err);
})*/

// create server
app.createServer = ()=>{
    const server = http.createServer(app.handleReqRes);

    server.listen(environment.port, ()=>{
        console.log(`Server listening success on this port ${environment.port}`)
    });
};

// handle Request Response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();