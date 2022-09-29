/**
 * Title: Data
 * Description:
 * Author: Alamgir Hossen
 * Date: 28-09-2022
 */

// dependencies
const fs = require('fs');
const path = require('path');

// module scaffolding
const lib = {};

// base directory of the data folder

lib.basedir = path.join(__dirname, '/../.data/');

// write data to file
lib.create = (dir, file, data, callback)=>{
    fs.open(lib.basedir+dir+'/'+file+'.json', 'wx', (err, fileDescriptor)=>{
        if (!err && fileDescriptor){
            // convert data to string
             const stringData = JSON.stringify(data);
             // write data to file and then close it
            fs.writeFile(fileDescriptor, stringData, (err)=>{
                if (!err){
                    fs.close(fileDescriptor, (err)=>{
                        if (!err){
                            callback(false)
                        }else {
                            callback('Error closing the new file!')
                        }
                    })
                }else {
                    callback(err)
                }
            })
        }else {
            callback(err)
        }
    })
}

// read data from file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir}/${dir}/${file}.json`, 'utf8', (err, data)=>{
        callback(err, data)
    })
}

// update existing file
lib.update = (dir, file, data, callback)=>{
    // file open for writing
    fs.open(`${lib.basedir}${dir}/${file}.json`, 'r+', (err, fileDescriptor)=>{
        if (!err && fileDescriptor){
            const stringData = JSON.stringify(data);

            // truncate the file
            fs.ftruncate(fileDescriptor, (err1)=>{
                if (!err1){
                    // write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, (err2)=>{
                        if (!err2){
                            // close the file
                            fs.close(fileDescriptor, (err3)=>{
                                if (!err3){
                                  callback(false)
                                }else {
                                    callback(err3.message)
                                }
                            })
                        }else {
                            callback(err2.message)
                        }
                    })
                }else {
                    console.log(err1)
                }
            })
        }else {
            console.log(err.message)
        }
    } )
}

// delete existing file
lib.delete = (dir, file, callback)=>{
    fs.unlink(`${lib.basedir}${dir}/${file}.json`, (err)=>{
        if (!err){
            callback(false)
        }else {
            callback(err.message)
        }
    })
}

module.exports = lib;