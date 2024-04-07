const bl = require('./businessLayer.js')

async function main(){
    // console.log( await bl.addStripeCustomer("max", "shengelia", "testemail@yahoo.com"))
    // console.log( await bl.deleteStripeCustomer("cus_PpM4PqlPSb9Sff"))
    // bl.emailCustomer("mas5627@g.rit.edu", "content")
    // console.log(await bl.getAvailableLocations(new Date(), new Date("09/04/2024")))


    var reserveInfo = {}
    reserveInfo.customerId = 1;
    reserveInfo.pickupStation = 3;
    reserveInfo.pickupDateTime = new Date(2024, 3, 6, 20, 30, 0);
    reserveInfo.dropoffStation = 2;
    reserveInfo.dropoffDateTime = new Date(2024, 3, 7, 20, 30, 0);

    console.log(await bl.addReservation(6, reserveInfo))
}

main()