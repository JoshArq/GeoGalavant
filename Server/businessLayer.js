const pg = require('./postGalavant.js');
require('dotenv').config()
var nodemailer = require('nodemailer');
const emailUser = process.env.EMAIL_USER
const emailPass = process.env.EMAIL_PASSWORD

// console.log(emailUser, emailPass)

var transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  secure: true,
  port: 465,
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });

var stripe_pk = process.env.STRIPE_PUBLIC_KEY;
var stripe_sk = process.env.STRIPE_SECRET_KEY;

const Stripe = require('stripe');
const stripe = Stripe(stripe_sk)


async function sampleFunction(id, startDate, endDate, obj){
    //check that a variable is present
    if(id==null || id==undefined){
        return {error: "id doesn't exist"};
    }
    //check if a variable is in the correct format
    else if(!Number.isInteger(id)){
        return {error: "id is not a number"};
    }

    //assume that we did similar checks for the dates, and have them as Dates that can be compared
    if(startDate>=endDate){
        return {error: "start date must be before end date"}
    }

    //just showing how you'd use this with data layer methods
    let result = await pg.getCar(1);
    if(result == -1){
        return {error: "failed to get car"}
    }

    return result;

    //here's how you'd use an object to update
    //let updateObject = await pg.getCar(1);
    //if obj.status != null || obj.status != undefined
    //updateObject.status = obj.status;
    //repeat for other fields
    //await pg.updateCar(updateObject);    
}


async function addStripeCustomer(name, email){
    
    const customer = await stripe.customers.create({
        name: name,
        email: email,
      });

      return customer
}


//must pass in Stripe cust id, not our internal ids
async function deleteStripeCustomer(custID){
    const deleted = await stripe.customers.del(custID);
    return deleted
}


async function setupNewCustomerCard(){
    const customer = await stripe.customers.create();


    const setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        payment_method_types: ['card'],
      });

    return setupIntent.client_secret


}


//must pass in Stripe cust id
async function addPaymentMethod(custID, cardInfo){
    console.log(cardInfo)

    var date = cardInfo.expirationDate.split("/")
    var expMonth = date[0]
    var expYear = "20" + date[1]
    
    const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: cardInfo.number,
          exp_month: expMonth,
          exp_year: expYear,
          cvc: cardInfo.ccv,
        },
      });

    const result = await stripe.paymentMethods.attach(
        paymentMethod.id,
        {
        customer: custID,
        }
    );

    console.log(result)
}

//Cases:
//AccountCreation
async function emailCustomer (email, content){
    var mailOptions

        mailOptions = {
            from: 'geogalavant@gmail.com',
            to: email,
            subject: 'Geogalavant Account Created',
            text: content
          };
    
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    
}


async function getAllCustomers(userAuth){
    if(!userAuth.validToken){
        return {error: "invalid authorization"}
    }
    let customers = await pg.getAllCustomers();
    if(customers == -1){
        return {error: "Failed to get customers"}
    }
    return customers;
}

async function getCustomerDetails(userAuth, inputData){
    if(!userAuth.validToken){
        return {error: "invalid authorization"}
    }
    let customer = await pg.getCustomerDetails(inputData.customerId);
    if(customer == -1){
        return {error: "Failed to get customer"}
    }
    if(customer == undefined){
        return {error: "Customer does not exist"}
    }
    // customer.licenseexpires =  new Date(customer.licenseexpires).valueOf();
    return customer;
}

//TODO: Generate email
async function addMessage(inputData){
    //check name
    if(inputData.name == null || inputData.name == undefined){
        return {error: "name cannot be null"};
    }
    if(inputData.name.length > 50){
        return {error: "name cannot be over 50 characters"};
    }
    //check email
    if(inputData.email == null || inputData.email == undefined){
        return {error: "email cannot be null"};
    }
    if(inputData.email.length > 50){
        return {error: "email cannot be over 50 characters"};
    }
    //check phone
    if(inputData.phone == null || inputData.phone == undefined){
        return {error: "phone cannot be null"};
    }
    if(inputData.phone.length > 11){
        return {error: "phone cannot be over 11 characters"};
    }
    if(!/^\d+$/.test(inputData.phone)){
        return {error: "phone must be a number"};
    }
    if(parseInt(inputData.phone)<0){
        return {error: "phone number cannot be negative"}
    }
    //check comment
    if(inputData.comment == null || inputData.comment == undefined){
        return {error: "comment cannot be null"};
    }
    //call function
    result = await pg.addTicket(inputData);
    //returns
    if(result == -1){
        //SEND EMAIL HERE
        return {error: "Failed to insert"};
    }
    //SEND EMAIL HERE
    return {ticketId: result};
}

async function getMessages(userAuth){
    if(!userAuth.validToken){
        return {error: "invalid authorization"}
    }
    let returnVals = await pg.getAllTickets();
    if(returnVals == -1){
        return {error: "failed to get tickets"}
    }
    // for(let i=0 ; i<returnVals.length ; i++){
    //     console.log(returnVals[i].submitted);
    //     const newDate = new Date(returnVals[i].submitted).toLocaleString();
    //     console.log(newDate)
    //     returnVals[i].submitted = newDate;
    // }
    return returnVals;
}

//TODO: Generate email
async function markMessageResolved(userAuth, inputData){
    if(!userAuth.validToken){
        return {error: "invalid authorization"}
    }
    if(inputData.ticketId == null || inputData.ticketId ==undefined){
        return { error: "ticket id must exist" }
    }
    if(inputData.userId == null || inputData.userId ==undefined){
        return { error: "user id must exist" }
    }
    //checks that ticket is valid
    const ticket = await pg.getTicket(inputData.ticketId);
    if(ticket == undefined){
        return { error: "Ticket with that id does not exist" }
    }
    if(ticket == -1){
        return { error: "failed to find ticket"}
    }
    //checks that user is valid
    const user = await pg.getUserById(inputData.userId);
    if(user == undefined){
        return { error: "User with that id does not exist" }
    }
    if(user == -1){
        return { error: "failed to find user"}
    }
    //sets ticket to resolved
    const updatedTicket = {
        name: ticket.name,
        submitted: ticket.submitted,
        phone: ticket.phone,
        email: ticket.email,
        comment: ticket.comment,
        isOpen: false,
        closedBy: inputData.userId,
        ticketId: inputData.ticketId
    };
    const result = await pg.updateTicket(updatedTicket);
    if(result == -1){
        return {error: "failed to resolve ticket"}
    }
    return {success: "resolved ticket"}
}

//TODO: Generate email to customer
async function changeStatus(userAuth, inputData){
    if(!userAuth.validToken){
        return {error: "invalid authorization"}
    }
    //validate
    if(inputData.reason == null || inputData.reason == undefined){
        return {error: "reason must exist"}
    }
    if(inputData.userId == null || inputData.userId == undefined){
        return {error: "userId must exist"}
    }
    if(inputData.userStatusId == null || inputData.userStatusId == undefined){
        return {error: "oldStatusId must exist"}
    }
    if(inputData.newStatusId == null || inputData.newStatusId == undefined){
        return {error: "newStatusId must exist"}
    }

    //check that user exists
    let user = await pg.getUserById(inputData.userId);
    if(user == undefined){
        return {error: "User does not exist"}
    }

    //if changing status to 3, which is active, changes role from 6 to 7
    if(inputData.newStatusId == 3){
        await pg.addUserRole(inputData.userId, 6);
        await pg.deleteUserRole(inputData.userId, 7);
    }
    //otherwise, changes to 6 from 7
    else{
        await pg.addUserRole(inputData.userId, 7);
        await pg.deleteUserRole(inputData.userId, 6);
    }
    //remove old status
    let rowsEffected = await pg.removeUserStatus(inputData.reason, inputData.userStatusId);
    if(rowsEffected == -1){
        return {error: "Failed to remove status"};
    }

    //add new status
    let statusId = await pg.addUserStatus(inputData.userId, inputData.newStatusId, inputData.reason);
    if(statusId == -1){
        return {error: "Failed to add status"};
    }

    //return
    return {statusId: statusId};
}

async function addStatus(userAuth, inputData){
    if(!userAuth.validToken){
        return {error: "invalid authorization"}
    }
    //validate
    if(inputData.reason == null || inputData.reason == undefined){
        return {error: "reason must exist"}
    }
    if(inputData.userId == null || inputData.userId == undefined){
        return {error: "userId must exist"}
    }
    if(inputData.statusId == null || inputData.statusId == undefined){
        return {error: "newStatusId must exist"}
    }

    //check that user exists
    let user = await pg.getUserById(inputData.userId);
    if(user == undefined){
        return {error: "User does not exist"}
    }

    //add new status
    let statusId = await pg.addUserStatus(inputData.userId, inputData.statusId, inputData.reason);
    if(statusId == -1){
        return {error: "Failed to add status"};
    }

    //return
    return {statusId: statusId};
}


//TODO finish DB logic
async function getAvailableLocations(t1, t2){
    var pickup = new Date(t1)
    var dropoff = new Date(t2)
    var today = new Date()

    var locations = []

    //if reservation for today
    if(pickup.getDate() === today.getDate() &&
    pickup.getMonth() === today.getMonth() &&
    pickup.getYear() === today.getYear()) {

        //get available stations today
        var stations = await pg.getAllStations()

        for(i = 0; i < stations.length; i++){
            let available = false;

            if(!stations[i].isclosed){
                cars = await pg.getStationCars(stations[i].stationid)

                

                for(j = 0; j < cars.length; j++){
                    
                    if(cars[j].carstatusid == 1){
                        available = true;
                        break;
                    }
                }

                if(available){
                    var thisStn = {};

                    thisStn.stationID = stations[i].stationid
                    thisStn.name = stations[i].stationname
                    thisStn.address = stations[i].address
                    thisStn.latitude = parseFloat(stations[i].minlatitude)
                    thisStn.longitude = parseFloat(stations[i].minlongitude)

                    locations.push(thisStn)
                  

                }
            }
        }


        //need to check if no overlap with future day reservation
        //most efficient way?

    } else {

        //check for overlap w/ fleet on every day
        //return all stations

    }

    //SELECT * FROM table WHERE date1 BETWEEN date2 AND date3

    //each car has a station (for "today")
    //each station has x cars

    //if i reserve today the station must have car already assigned to it
    // & must have enough cars over the next few days

    //if i reserve a car in the future it may be from any station, so long as the total fleet has enough cars to accomodate that day

    return locations
}


async function addReservation(userID, data){
    custID = (await pg.getCustomerByUserId(userID)).customerid

    data.customerId = custID;
    
    var conf = "" + (Math.floor(Math.random() * 10000));
    while(conf.length < 4){
        conf = "0" + conf
    }

    data.confirmationNumber = conf

    pg.addReservation(data)


    return data.confirmationNumber
   
   
    //assign car ID if today
        //assign car day before/day of if future - TODO?
 
}



module.exports = {
    getAllCustomers,
    getCustomerDetails,
    changeStatus,
    addStatus,
    getMessages,
    markMessageResolved,
    addMessage,
    addStripeCustomer,
    deleteStripeCustomer,
    addPaymentMethod,
    emailCustomer,
    setupNewCustomerCard,
    getAvailableLocations,
    addReservation
}