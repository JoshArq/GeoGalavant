const bl = require('./businessLayer.js')

async function main(){
    // console.log( await bl.addStripeCustomer("max", "shengelia", "testemail@yahoo.com"))
    // console.log( await bl.deleteStripeCustomer("cus_PpM4PqlPSb9Sff"))
    // bl.emailCustomer("mas5627@g.rit.edu", "content")
    // console.log(await bl.getAvailableLocations(new Date(), new Date("09/04/2024")))


    var reserveInfo = {}
    reserveInfo.customerId = 1;
    reserveInfo.pickupStation = 2;
    reserveInfo.pickupDateTime = new Date(2024, 3, 8, 20, 30, 0);
    reserveInfo.dropoffStation = 2;
    reserveInfo.dropoffDateTime = new Date(2024, 3, 8, 22, 30, 0);

    // console.log(await bl.addReservation(6, reserveInfo))

    // console.log(await bl.getCustomerReservations(6))

    // console.log(await bl.getReservationByID(4))

    // console.log(await bl.editReservation({
    //     reservationID: 2,
    //     pickupStation: 3,
    //     dropoffStation: 1,
    //     pickupDateTime: "04/09/2024",
    //     dropoffDateTime: "04/09/2024"
    // }))

    // bl.getReservePrice("2024-04-08T16:30:53.669Z", "2024-04-08T21:58:53.669Z")

    

}

main()