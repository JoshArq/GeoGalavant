//This serves as a unit testing file for our Data Layer
//https://www.w3schools.com/nodejs/ref_assert.asp

const assert = require('assert');
const pg = require('./postGalavant.js')


async function main(){ 
    // pg.pulseCheck()
    
    //Login tests
    // console.log(await pg.login("bbb", "bbb"))
    // console.log(await pg.login("max123", "password"))

    //Testing adding and removing user role
    //console.log(await pg.deleteUserRole(1,1));
    //console.log(await pg.addUserRole(1,1));

    //testing adding and removing user status
    console.log(await pg.removeUserStatus("Testing", 1));
    console.log(await pg.addUserStatus(1,1,"Testing"));

    //Customer Creation Tests
    var custObj = {
        "username": "max123",
        "password": "password",
        "email": "random@yahoo.com",
        "appliedbefore": false,
        "tos": true,
        "driversLicense": {
            "firstName": "max",
            "lastName": "Shengelia",
            "state": "MO",
            "ID": "8888888888",
            "expirationDate": "22/2/27"
        },
        "creditCard": {
            "number": "11111111",
            "fullName": "Max S",
            "expirationDate": "11/1/27",
            "ccv": "666"
        }
    }
    
    // userID = await pg.createUser(custObj);
    // await pg.addUserRole(userID, 2)


}

main()