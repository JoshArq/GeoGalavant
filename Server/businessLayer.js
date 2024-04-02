const pg = require('./postGalavant.js');
require('dotenv').config()
var nodemailer = require('nodemailer');
const emailUser = process.env.EMAIL_USER
const emailPass = process.env.EMAIL_PASSWORD

console.log(emailUser, emailPass)

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
async function emailCustomer (email, name, reason){
    var mailOptions


    if(reason == "AccountCreation"){

        var text = "Congrats " + name + ", your account was successfully created!"

        mailOptions = {
            from: 'geogalavant@gmail.com',
            to: email,
            subject: 'Geogalavant Account Created',
            text: text
          };
    }
    
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
    customer.licenseexpires =  new Date(customer.licenseexpires).valueOf();
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
    for(let i=0 ; i<returnVals.length ; i++){
        returnVals[i].submitted = new Date(returnVals[i].submitted).valueOf();
    }
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
    if(inputData.statusId == null || inputData.statusId == undefined){
        return {error: "statusId must exist"}
    }
    if(inputData.userStatusId == null || inputData.userStatusId == undefined){
        return {error: "userStatusId must exist"}
    }

    //check that user exists
    let user = await pg.getUserById(inputData.userId);
    if(user == undefined){
        return {error: "User does not exist"}
    }

    //remove old status
    let rowsEffected = await pg.removeUserStatus(inputData.reason, inputData.userStatusId);
    if(rowsEffected == -1){
        return {error: "Failed to remove status"};
    }

    //add new status
    let statusId = await pg.addUserStatus(inputData.userId, inputData.statusId, inputData.reason);
    if(statusId == -1){
        return {error: "Failed to add status"};
    }

    //return
    return {statusId: statusId};
}

module.exports = {
    getAllCustomers,
    getCustomerDetails,
    changeStatus,
    getMessages,
    markMessageResolved,
    addMessage,
    addStripeCustomer,
    deleteStripeCustomer,
    addPaymentMethod,
    emailCustomer,
    setupNewCustomerCard
}