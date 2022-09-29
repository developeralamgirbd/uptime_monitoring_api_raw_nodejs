/**
 * Title: Environment
 * Description: Handle all environment related thinks
 * Author: Alamgir Hossen
 * Date: 28-09-2022
 */

// dependencies

// module scaffolding
const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'fksdklfjsdklfjsdlkfjsdlkflksdj'
}

environments.production = {
    port: 4000,
    envName: 'production',
    secretKey: 'asdfklsfeidsfcxlcxjfdsmewlkdsfjooosslq '
}

// determine which environment was passed
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
const environmentToExport = typeof environments[currentEnvironment] === 'object'
    ? environments[currentEnvironment]
    : environments.staging;
// console.log(environmentToExport)
// export module
module.exports = environmentToExport;