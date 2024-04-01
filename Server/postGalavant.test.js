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
    //console.log(await pg.removeUserStatus("Testing", 1));
    //console.log(await pg.addUserStatus(1,1,"Testing"));

    //testing select stations
    //console.log(await pg.getAllStations());
    //console.log(await pg.getStation(1));

    //Testing CRUD operations for reservations
    // let insertRes = {
    //     customerId: 1,
    //     pickupStationId:1,
    //     dropoffStationId: 1,
    //     scheduledPickupTime: "2024-01-26 15:47:44",
    //     scheduledDropofftime: "2024-01-26 17:47:44",
    //     rate: 20,
    //     fees: 5,
    //     cardId: 1,
    //     confirmationNumber: 1111
    // };
    // let insertId = await pg.addReservation(insertRes)
    // console.log(insertId);
    // console.log(await pg.getCustomerReservations(1))
    // let updateRes = {
    //     customerId: 1,
    //     pickupStationId:1,
    //     dropoffStationId: 1,
    //     scheduledPickupTime: "2024-02-16 15:47:44",
    //     pickupTime: "2024-02-16 15:47:44",
    //     scheduledDropofftime: "2024-02-16 17:47:44",
    //     dropoffTime: "2024-02-16 17:47:44",
    //     rate: 20,
    //     fees: 5,
    //     cardId: 1,
    //     carId: 1,
    //     rentalId: insertId,
    //     confirmationNumber: 1111
    // };
    // console.log(await pg.updateReservation(updateRes))
    // console.log(await pg.getReservation(insertId))
    // console.log(await pg.removeReservation(insertId))

    //Testing CRUD operations for credit cards
    // let insertCard = {
    //     paymentTypeId: 1,
    //     cardName: "Albert Albertson",
    //     cardNumber: "1111111",
    //     expirationDate: "09/22",
    //     cvv: "111",
    //     customerId: 1
    // };
    
    // let insertId = await pg.addCreditCard(insertCard);
    // console.log("Testing insert card\n" + insertId)
    // console.log("Testing get cards by customer\n");
    // console.log(await pg.getCreditCardsByCustomer(1))
    // let editCard = {
    //     paymentTypeId: 1,
    //     cardName: "Albert Albertson",
    //     cardNumber: "1111111",
    //     expirationDate: "12/25",
    //     cvv: "111",
    //     customerId: 1,
    //     cardId: insertId
    // };
    // console.log("Testing edit card");
    // console.log(await pg.editCreditCard(editCard));
    // console.log("Testing get specific card");
    // console.log(await pg.getCreditCard(insertId));
    // console.log("Testing remove card");
    // console.log(await pg.removeCreditCard(insertId));

    //testing CRUD operations for cars
    // let insertCar = {
    //     stationId: 1,
    //     carStatusId:1
    // };
    // let insertId = await pg.addCar(insertCar);
    // console.log("Testing insert car");
    // console.log(insertId);
    // console.log("Testing get car by station");
    // console.log(await pg.getStationCars(1));
    // console.log("testing get car by status");
    // console.log(await pg.getCarsByStatus(1));
    // console.log("testing get all cars");
    // console.log(await pg.getAllCars());
    // let editCar = {
    //     stationId: 2,
    //     carStatusId:2,
    //     carId: insertId
    // };
    // console.log("Testing edit car");
    // console.log(await pg.editCar(editCar));
    // console.log("Testing get specific car");
    // console.log(await pg.getCar(insertId));
    // console.log("Testing remove car");
    // console.log(await pg.removeCar(insertId));

    //testing data layer methods for car locations
    // let add1 = {
    //     carId: 1,
    //     time: "2022-02-16 15:47:44",
    //     latitude:11.1111,
    //     longitude:11.1111
    // };
    // let add2 = {
    //     carId: 1,
    //     time: "2024-02-16 15:47:44",
    //     latitude: 11.2222,
    //     longitude:11.2222
    // }
    // let add3 = {
    //     carId: 2,
    //     time: "2024-02-16 15:47:44",
    //     latitude: 12.2222,
    //     longitude: 12.2222
    // }
    // console.log("testing addCarLocation");
    // console.log( await pg.addCarLocation(add1) );
    // console.log( await pg.addCarLocation(add2) );
    // console.log( await pg.addCarLocation(add3) );
    // console.log("Testing getCarLocations");
    // console.log( await pg.getCarLocations(1) );
    // console.log("Testing getCurrentLocations");
    // console.log( await pg.getCurrentLocations() );
    // console.log("Testing getCurrentCarLocation")
    // console.log( await pg.getCurrentCarLocation(1) );
    // console.log("Testing remove before");
    // console.log(await pg.removeCarLocationsBefore("2023-02-16"));
    // console.log("Retrieving");
    // console.log( await pg.getCarLocations(1) );
    // console.log("Removing all");
    // console.log(await pg.removeCarLocationsBefore("2025-02-16"));
    console.log(await pg.getAllTickets())
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