const bl = require('./businessLayer.js')

async function main(){
    // console.log( await bl.addStripeCustomer("max", "shengelia", "testemail@yahoo.com"))
    // console.log( await bl.deleteStripeCustomer("cus_PpM4PqlPSb9Sff"))
    // bl.emailCustomer("mas5627@g.rit.edu", "content")
    console.log(await bl.getAvailableLocations(new Date(), new Date("09/04/2024")))
}

main()