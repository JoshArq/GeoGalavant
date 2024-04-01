const pg = require('./postGalavant.js');
require('dotenv').config()
var nodemailer = require('nodemailer');
const emailUser = process.env.EMAIL_USER
const emailPass = process.env.EMAIL_PASSWORD

console.log(emailUser, emailPass)

var transporter = nodemailer.createTransport({
    service: 'smtp-relay.gmail.com',
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



module.exports = {
    addStripeCustomer,
    deleteStripeCustomer,
    addPaymentMethod,
    emailCustomer
}