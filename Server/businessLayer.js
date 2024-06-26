const pg = require('./postGalavant.js');
require('dotenv').config()
var nodemailer = require('nodemailer');
const emailUser = process.env.EMAIL_USER
const emailPass = process.env.EMAIL_PASSWORD

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
}

//Cases:
//AccountCreation
async function emailCustomer (email, subject, content){
    var mailOptions

        mailOptions = {
            from: 'geogalavant@gmail.com',
            to: email,
            subject: subject,
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
    //checks that ticket is valid
    const ticket = await pg.getTicket(inputData.ticketId);
    if(ticket == undefined){
        return { error: "Ticket with that id does not exist" }
    }
    if(ticket == -1){
        return { error: "failed to find ticket"}
    }
    //sets ticket to resolved
    const updatedTicket = {
        name: ticket.name,
        submitted: ticket.submitted,
        phone: ticket.phone,
        email: ticket.email,
        comment: ticket.comment,
        isOpen: false,
        closedBy: userAuth.id,
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

    //check that user exists
    let user = await pg.getUserById(inputData.userId);
    if(user == undefined){
        return {error: "User does not exist"}
    }

    //if changing status to 3, which is active, changes role from 7 to 6
    if(inputData.statusId == 3 && user.roleid == 7){
        try{
            await pg.addUserRole(inputData.userId, 6);
            await pg.deleteUserRole(inputData.userId, 7);
        }
        catch(err){

        }
    }
    //otherwise, changes to 6 from 7
    else if(inputData.statusId != 3 && user.roleid != 7){
        try{
            await pg.addUserRole(inputData.userId, 7);
            await pg.deleteUserRole(inputData.userId, 6);
        }catch(err){}
    }

    //add new status
    let statusId = await pg.updateUserStatus(inputData.userId, inputData.statusId);
    if(statusId == -1){
        return {error: "Failed to change status"};
    }

    switch(inputData.statusId){
        case 2:
            this.emailCustomer(user.email, "GyroGoGo Account Suspended", `Your Account has been suspended. \n Reason: \n ${inputData.reason}`)
            break;
        case 3:
            this.emailCustomer(user.email, "GyroGoGo Account is now Active", `Your GyroGoGo account is now active! \n Reason: \n ${inputData.reason} \nHappy Driving!`)
            break;
        case 4:
            this.emailCustomer(user.email, "GyroGoGo Account Denied", `Your GyroGoGo Account has been suspended \n Reason: \n ${inputData.reason}`)
            break;
        case 5: 
            this.emailCustomer(user.email, "GyroGoGo Account Terminated", `Your GyroGoGo Account has been suspended \n Reason: \n ${inputData.reason}`)
            break;
        default:
            break;
    }

    //return
    return {success: "Updated status"};
}

async function addStatus(userAuth, inputData){
    if(!userAuth.validToken){
        return {error: "invalid authorization"}
    }
    if(inputData.userId == null || inputData.userId == undefined){
        return {error: "userId must exist"}
    }
    if(inputData.statusId == null || inputData.statusId == undefined){
        return {error: "statusID must exist"}
    }

    //check that user exists
    let user = await pg.getUserById(inputData.userId);
    if(user == undefined){
        return {error: "User does not exist"}
    }

    //add new status
    let statusId = await pg.addUserStatus(inputData.userId, inputData.statusId);
    if(statusId == -1){
        return {error: "Failed to add status"};
    }

    //return
    return {success: "Added Status"};
}

async function getAllCars(auth){
    if(!auth.validToken){
        return {error: "invalid authorization"}
    }
    let cars = await pg.getAllCars();
    if(cars == -1){
        return {error: "Failed to retrieve cars"};
    }
    return cars;
}

async function getCarDetails(auth, data){
    if(!auth.validToken){
        return {error: "invalid authorization"}
    }
    if(data.carId == null || data.carId == undefined){
        return {error: "carId must be present"}
    }
    if(!Number.isInteger(data.carId)){
        return {error: "carId must be a number"};
    }
    let car = await pg.getCar(data.carId);
    if(car == undefined){
        return {error: "Car with that ID does not exist"}
    }
    if(car == -1){
        return {error: "Failed to get car"}
    }
    return car;
}

async function addCar(auth,data){
    if(!auth.validToken){
        return {error: "invalid authorization"}
    }
    if(data.stationId == null || data.stationId == undefined){
        return {error: "stationId must be present"}
    }
    if(!Number.isInteger(data.stationId)){
        return {error: "stationId must be a number"};
    }
    if(data.carStatusId == null || data.carStatusId == undefined){
        return {error: "carStatusId must be present"}
    }
    if(!Number.isInteger(data.carStatusId)){
        return {error: "carStatusId must be a number"};
    }
    const station = await pg.getStation(data.stationId);
    if(station == undefined){
        return {error: "Station does not exist"};
    }
    let carId = await pg.addCar(data);
    if(carId == -1){
        return {error: "Failed to add car"}
    }
    return {carId: carId}
}

async function removeCar(auth,data){
    if(!auth.validToken){
        return {error: "invalid authorization"}
    }
    if(data.carId == null || data.carId == undefined){
        return {error: "carId must be present"}
    }
    if(!Number.isInteger(data.carId)){
        return {error: "carId must be a number"};
    }
    const car = await pg.getCar(data.carId);
    if(car == undefined){
        return {error: "Car with that ID does not exist"}
    }
    const rowCount = await pg.removeCar(data.carId);
    if(rowCount == 1){
        return {success: "removed car"}
    }
    return {error: "Failed to delete car"}
}

async function updateCar(auth,data){
    if(!auth.validToken){
        return {error: "invalid authorization"}
    }
    if(data.carId == null || data.carId == undefined){
        return {error: "carId must be present"}
    }
    if(!Number.isInteger(data.carId)){
        return {error: "carId must be a number"};
    }
    if((data.stationId == null || data.stationId==undefined) && (data.carStatusId == null || data.carStatusId == undefined)){
        return {error: "Must include something to update"}
    }
    var car = await pg.getCar(data.carId);
    if(data.stationId != null || data.stationId!=undefined){
        if(!Number.isInteger(data.carId)){
            return {error: "stationId must be a number"};
        }
        const station = await pg.getStation(data.stationId);
        if(station == undefined){
            return {error: "Station with that ID doesn't exist"}
        }
    }
    if(data.carStatusId != null || data.carStatusId!=undefined){
        if(!Number.isInteger(data.carStatusId)){
            return {error: "stationId must be a number"};
        }
    }
    var car = await pg.getCar(data.carId);

    let updateObj = data
    if(car == undefined){
        return {error: "Car with that ID does not exist"}
    }

    if(updateObj.stationId == null || updateObj.stationId==undefined){
        updateObj.stationId = car.stationid
    }
    if(updateObj.carStatusId == null || updateObj.carStatusId==undefined){
        updateObj.carStatusId = car.statusid
    }
    var result = await pg.editCar(updateObj);
    if(result == 1){
        return {success: "Updated Car"}
    }
    return {error: "Failed to update car"}
}

async function getWorkOrders(auth, data){
    if(!auth.validToken){
        return {error: "invalid authorization"}
    }
    if(data.carId == null || data.carId == undefined){
        return {error: "carId must exist"}
    }
    if(!Number.isInteger(data.carId)){
        return {error: "carId must be a number"};
    }
    let workOrders = await pg.getMaintenance(data.carId);
    if(workOrders == -1){
        return {error: "Failed to retrieve work orders"};
    }
    return workOrders;
}

async function addWorkOrder(auth,data){
    if(!auth.validToken){
        return {error: "invalid authorization"}
    }
    data.mechanic = auth.id;
    if(data.stationId == null || data.stationId == undefined){
        return {error: "stationId must be present"}
    }
    if(!Number.isInteger(data.stationId)){
        return {error: "stationId must be a number"};
    }
    if(data.carId == null || data.carId == undefined){
        return {error: "carId must be present"}
    }
    if(!Number.isInteger(data.carId)){
        return {error: "carId must be a number"};
    }
    if(data.hasDamage == null || data.hasDamage == undefined){
        return {error: "hasDamage must be present"}
    }
    if(data.hasDamage!="true" && data.hasDamage!="false"){
        return {error: "hasDamage must be true or false"}
    }
    if(data.servicePerformed == null || data.servicePerformed == undefined){
        return {error: "servicePerformed must be present"}
    }
    if(data.maintenanceStart == null || data.maintenanceStart == undefined){
        return {error: "maintenanceStart must be present"}
    }
    const station = await pg.getStation(data.stationId);
    if(station == undefined){
        return {error: "Station does not exist"};
    }
    const car = await pg.getCar(data.carId);
    if(car == undefined){
        return {error: "Car does not exist"};
    }
    var maintenanceId = await pg.addMaintenance(data);

    if(maintenanceId != -1){
        return {maintenanceId: maintenanceId}
    }
}

async function addStation(auth,data){
    if(!auth.validToken){
        return {error: "invalid authorization"}
    }
    //check if latitude exists in proper format
    if(data.longitude == null || data.longitude == undefined){
        return {error: "longitude must exist"}
    }
    if(Number.isNaN(Number.parseFloat(data.longitude))){
        return {error: "longitude must be a number"}
    }

    //check if longitude exists in proper format
    if(data.latitude == null || data.latitude == undefined){
        return {error: "latitude must exist"}
    }
    if(Number.isNaN(Number.parseFloat(data.latitude))){
        return {error: "latitude must be a number"}
    }

    //check if name exists
    if(data.stationName == null || data.stationName == undefined){
        return {error: "stationName must exist"}
    }
    
    //check if address exists
    if(data.address == null || data.address == undefined){
        return {error: "address must exist"}
    }

    //check if isClosed exists and is boolean
    if(data.isClosed == null || data.isClosed == undefined){
        return {error: "isClosed must exist"}
    }
    if(data.isClosed!="true" && data.isClosed!="false"){
        return {error: "hasDamage must be true or false"}
    }

    //insert
    const stationId = await pg.addStation(data);

    if(stationId == undefined || stationId == -1){
        return {error: "Failed to add station"}
    }

    //return stationid
    return {stationId: stationId}
}

async function addEmployee(auth, data){
    if(!auth.validToken){
        return {error: "invalid authorization"}
    }

    //check username
    if(data.username == null || data.username == undefined){
       return {error: "username must exist"}
    }
    
    //check password
    if(data.password == null || data.password == undefined){
        return {error: "password must exist"}
    }

    //check firstName
    if(data.firstName == null || data.firstName == undefined){
        return {error: "firstName must exist"}
    }

    //check lastName
    if(data.lastName == null || data.lastName == undefined){
        return {error: "lastName must exist"}
    }

    //check email
    if(data.email == null || data.email == undefined){
        return {error: "email must exist"}
    }

    //check role
    if(data.role == null || data.role == undefined){
        return {error: "role must exist"}
    }
    if(!Number.isInteger(data.role)){
        return {error: "role must be a number"};
    }
    //check status
    if(data.status == null || data.status == undefined){
        return {error: "status must exist"}
    }
    const validStatuses = ["Active", "Suspended", "Terminated"];
    if(!validStatuses.includes(data.status)){
        return {error: "invalid status"}
    }
    data.driversLicense = {firstName: data.firstName, lastName:data.lastName}

    //insert user
    const empId = await pg.addUser(data);

    //insert role
    var roleId = await pg.addUserRole(empId, data.role)

    //insert employee
    var res = await pg.addEmployee(data.status, empId)

    //return
    if(res != -1){
        return {empId: empId}
    }

    return {error: "Failed to add employee"}
}

async function getAllEmployees(auth){
    if(!auth.validToken){
        return {error: "invalid authorization"}
    }
    const employees = await pg.getAllEmployees();
    if(employees == -1){
        return {error: "Failed to get employees"}
    }
    return employees;
}

async function changeEmployeeStatus(auth,data){
    if(!auth.validToken){
        return {error: "invalid authorization"}
    }
    if(data.status == null || data.status == undefined){
        return {error: "status must be present"}
    }
    const validStatuses = ["Active", "Suspended", "Terminated"];
    if(!validStatuses.includes(data.status)){
        return {error: "invalid status"}
    }
    if(data.empId == null || data.empId == undefined){
        return {error: "empId must be present"}
    }
    if(!Number.isInteger(data.empId)){
        return {error: "empId must be a number"};
    }
    const rowCount = await pg.updateEmployeeStatus(data);
    if(rowCount != 1){
        return {error: "Failed to update status"}
    }
    return {success:"updated status"}
}

async function getEmployeeDetails(auth,data){
    if(!auth.validToken){
        return {error: "invalid authorization"}
    }
    if(data.empId == null || data.empId == undefined){
        return {error: "empId must be present"}
    }
    if(!Number.isInteger(data.empId)){
        return {error: "empId must be a number"};
    }
    const emp = await pg.getEmployee(data);
    if(emp == -1 || emp == undefined){
        return {error: "failed to get employee"};
    }
    return emp;
}

async function getStateProvince(auth){
    if(!auth.validToken){
        return {error: "invalid authorization"}
    }
    const sp = await pg.getStateProvince();

    if(sp != -1){
        return sp;
    }
    return{error: "failed to get states and provinces"}
}


//TODO finish DB logic
async function getAvailableLocations(auth, data){
    if(!auth.validToken){
        return {error: "invalid authorization"}
    }
    if(data.pickup == null || data.pickup == undefined){
        return {error: "must have pickup"}
    }
    if(data.dropoff == null || data.dropoff == undefined){
        return {error: "must have pickup"}
    }
    var pickup = new Date(data.pickup)
    var dropoff = new Date(data.dropoff)
    var today = new Date()

    var locations = []

    //if reservation for today
    if(pickup.getDate() === today.getDate() &&
    pickup.getMonth() === today.getMonth() &&
    pickup.getYear() === today.getYear()) {

        //get available stations today
        var res = await pg.getCurrentCarAvailability(pickup)

        if(res == -1){
            return {error: "failed to find"}
        }
        return {locations: res};

    } 
    else { //reservation for a future day
        var available = await pg.canFleetAccomodateDay(pickup)

        if(available != 1){
            return {success: false, errorMessage: "We cannot accomodate your request for this day."}
        }

        var stations = await pg.getAllStations()

        //check for overlap w/ fleet on every day
        //return all stations
        for(i = 0; i < stations.length; i++){
            var thisStn = {};

            thisStn.stationID = stations[i].stationid
            thisStn.name = stations[i].stationname
            thisStn.address = stations[i].address
            thisStn.latitude = stations[i].minlatitude
            thisStn.longitude = stations[i].minlongitude

            locations.push(thisStn)
        }
    }


    return {locations: locations}
}


async function addReservation(auth, data){
    if(!auth.validToken){
        return {error: "invalid authorization"}
    }

    const cust = (await pg.getCustomerByUserId(auth.id))
    if(cust == undefined){
        return {error: "failed to find customer"}
    }
    const custID = cust.customerid;
    if(custID == undefined){
        return {error: "failed to find customer"}
    }

    data.customerId = custID;
    
    var conf = "" + (Math.floor(Math.random() * 10000));
    while(conf.length < 4){
        conf = "0" + conf
    }

    data.confirmationNumber = conf

    if(data.pickupStation == null || data.pickupStation == undefined){
        return {error: "pickupStation must exist"}
    }
    if(!Number.isInteger(data.pickupStation)){
        return {error: "pickupStation must be an integer"}
    }
    const station1 = await pg.getStation(data.pickupStation);
    if(station1 == null || station1 == undefined){
        return {error: "pickupStation does not exist"}
    }
    if(station1 == -1){
        return {error: "pickupStation not found"}
    }
    if(data.dropoffStation == null || data.dropoffStation == undefined){
        return {error: "dropoffStation must exist"}
    }
    if(!Number.isInteger(data.dropoffStation)){
        return {error: "dropoffStation must be an integer"}
    }
    const station2 = await pg.getStation(data.dropoffStation);
    if(station2 == null || station2 == undefined){
        return {error: "dropoffStation does not exist"}
    }
    if(station2 == -1){
        return {error: "dropoffStation not found"}
    }
    if(data.pickupDateTime == null || data.pickupDateTime == undefined){
        return {error: "pickupDateTime must exist"}
    }
    if(data.dropoffDateTime == null || data.dropoffDateTime == undefined){
        return {error: "dropoffDateTime must exist"}
    }
    const today = new Date();
    const pickup = new Date(data.pickupDateTime);
    const dropoff = new Date(data.pickupDateTime);

    //for same day reservations, assign a car
    if(pickup.getDate() === today.getDate() &&
    pickup.getMonth() === today.getMonth() &&
    pickup.getYear() === today.getYear()) {
        const car = (await pg.getStationCars(data.pickupStation))[0]
        if(car == undefined || car == null){
            return {error: "Failed to find car"}
        }
        if(car == -1){
            return {error: "Failed to find car"}
        }
        const droppedOff = new Date(car.max);
        const interval = pickup.getTime() - droppedOff.getTime()
        if(interval < 3600000 ){
            return {error: "Cars are charging"}
        }
        data.carId = car.carid;
        var res = await pg.addReservationToday(data);
        if(res == -1){
            return {error: "Failed to reserve"}
        }
        res = await pg.editCar({stationId: data.pickupStation, carId: data.carId, carStatusId: 3});

        this.emailCustomer(cust.email, "GyroGoGo Reservation Created", `You have reserved a Gyrocar! \nPickup: ${station1.stationname}, ${station1.address} at ${pickup.toLocaleString('en-US', {timezone: 'EST'})} \nDropoff: ${station2.stationname}, ${station2.address} at ${dropoff.toLocaleString('en-US', {timezone: 'EST'})} \nConfirmation Number: ${data.confirmationNumber} \nCar Number: ${data.carId}`)
        return {conf: data.confirmationNumber}
    }
    else{
        //check that there are enough cars
        var res = await pg.canFleetAccomodateDay(new Date(data.pickupDateTime))
        if(res == 1){
            res = await pg.addReservation(data)
            if(res == -1){
                return {error: "Failed to reserve"}
            }
            else{
                this.emailCustomer(cust.email, "GyroGoGo Reservation Created", `You have reserved a Gyrocar! \nYou will recieve an email the day of the reservation with the car number. \nPickup: ${station1.stationname}, ${station1.address} at ${pickup.toLocaleString('en-US', {timezone: 'EST'})} \nDropoff: ${station2.stationname}, ${station2.address} at ${dropoff.toLocaleString('en-US', {timezone: 'EST'})} \nConfirmation Number: ${data.confirmationNumber}`)
                return {conf: data.confirmationNumber}
            }
        }
        else{
            return {error:"Fleet cannot accomadate reservation"}
        }
    }
}


async function getCustomerReservations(auth, data){
    if(!auth.validToken){
        return {error: "invalid authorization"}
    }
    if(data.userID == null || data.userID == undefined){
        return {error: "userID must exist"}
    }
    var result = []
    
    var cust = await pg.getCustomerByUserId(data.userID)
    if(cust == undefined || cust == -1){
        return {error: "customer not found"}
    }
    var custID = cust.customerid;
    if(custID == undefined){
        return {error: "customer not found"}
    }
    var reservations = await pg.getCustomerReservations(custID)

    if(reservations == -1){
        return {error: "reservations not found"}
    }

    for(i = 0; i < reservations.length; i++){
        var thisRes ={}
        thisRes.reservationNumber = reservations[i].rentalid
        thisRes.pickupDateTime = reservations[i].scheduledpickuptime
        thisRes.dropoffDateTime = reservations[i].scheduleddropofftime

        var pickupStn = await pg.getStation(reservations[i].pickupstationid)

        thisRes.pickupStationName = pickupStn.stationname
        thisRes.pickupStationAddress = pickupStn.address

        var dropoffStn = await pg.getStation(reservations[i].dropoffstationid)

        thisRes.dropoffStationName = dropoffStn.stationname
        thisRes.dropoffStationAddress = dropoffStn.address

        result.push(thisRes)
    }

    return result;
}


async function getReservationByID(auth, data){
    if(!auth.validToken){
        return {error: "invalid authorization"}
    }
    if(data.reservationID == null || data.reservationID == undefined){
        return {error: "reservationID must exist"}
    }
    if(!Number.isInteger(data.reservationID)){
        return {error: "reservationID must be an integer"}
    }
    var reservation = await pg.getReservation(data.reservationID)
    if(reservation == -1 ){
        return {error: "failed to find reservation"}
    }
    if(reservation == undefined){
        return {error: "reservation does not exist"}
    }
    var result = {}

    result.pickupDateTime = reservation.scheduledpickuptime
    result.dropoffDateTime = reservation.scheduleddropofftime
    result.confirmationNumber = reservation.confirmationnumber

    var pickupStn = await pg.getStation(reservation.pickupstationid)

    result.pickupStationName = pickupStn.stationname
    result.pickupStationAddress = pickupStn.address

    var dropoffStn = await pg.getStation(reservation.dropoffstationid)

    result.dropoffStationName = dropoffStn.stationname
    result.dropoffStationAddress = dropoffStn.address

    return result
}

async function deleteReservation(auth, data){
    if(!auth.validToken){
        return {success: false, error: "invalid authorization"}
    }
    if(data.reservationID == null || data.reservationID == undefined){
        return {success: false, error: "reservationID must exist"}
    }
    if(!Number.isInteger(data.reservationID)){
        return {success: false, error: "reservationID must be an integer"}
    }
    const res = await pg.removeReservation(data.reservationID)
    if(res == -1){
        return {success: false, error: "Failed to delete reservation"}
    }
    return {success: true}
}


async function editReservation(auth, data){
    if(!auth.validToken){
        return {success: false, error: "Invalid Authorization"}
    }
    if(data.reservationID == null || data.reservationID == undefined){
        return {success: false, error: "reservationID must exist"}
    }
    if(!Number.isInteger(data.reservationID)){
        return {success: false, error: "reservationID must be an integer"}
    }

    var res = await pg.getReservation(data.reservationID)
    if(res == undefined ){
        return {success: false, error: "reservation does not exist"}
    }
    if(res == -1){
        return {success: false, error: "failed to edit reservation"}
    }

    var cust = await pg.getCustomerDetails(res.customerid);

    let newRes = {}

    console.log(data)

    newRes.rentalId = data.reservationID
    newRes.customerId = res.customerid
    if(data.pickupStation == null || data.pickupStation == undefined){
        newRes.pickupStationId = res.pickupstationid;
    }
    else{
        newRes.pickupStationId = data.pickupStation
    }
    if(data.scheduledPickupTime == null || data.scheduledPickupTime == undefined){
        newRes.scheduledPickupTime = res.scheduledpickuptime;
    }
    else{
        newRes.scheduledPickupTime = data.scheduledPickupTime;
    }
    if(data.dropoffStation == null || data.dropoffStation == undefined){
        newRes.dropoffStationId = res.dropoffstationid;
    }
    else{
        newRes.dropoffStationId = data.dropoffStation
    }
    if(data.scheduledDropoffTime == null || data.scheduledDropoffTime == undefined){
        newRes.scheduledDropoffTime = res.scheduleddropofftime; 
    }
    else{
        newRes.scheduledDropoffTime = data.scheduledDropoffTime;
    }

    newRes.cardId = null

    if(data.carID == null || data.carID == undefined ){
        newRes.carId = res.carid
    }
    else{
        newRes.carId = data.carid
    }
    if(data.actualPickupTime == null || data.actualPickupTime == undefined){
        newRes.pickupTime = res.pickuptime;
    }
    else{
        newRes.pickupTime = data.actualPickupTime;
    }
    if(data.actualDropoffTime == null || data.actualDropoffTime == undefined){
        newRes.dropoffTime = res.dropofftime;
    }
    else{
        newRes.dropoffTime = data.actualDropoffTime;
    }
    newRes.confirmationNumber = res.confirmationnumber

    const station1 = await pg.getStation(newRes.pickupStationId);
    if(station1 == null || station1 == undefined){
        return {success:false, error: "pickup station does not exist"}
    }
    if(station1 == -1){
        return {success:false, error: "pickup station not found"}
    }

    //get a new car
    const today = new Date();
    const pickup = new Date(newRes.scheduledPickupTime);

    //for same day reservations, assign a car
    if((data.pickupStation != null && data.pickupStation != undefined && data.pickupStation != newRes.pickupStationId) && (pickup.getDate() === today.getDate() &&
    pickup.getMonth() === today.getMonth() &&
    pickup.getYear() === today.getYear())) {
        const car = (await pg.getStationCars(data.pickupStation))[0]
        if(car == undefined || car == null){
            return {success: false, error: "No car available at that station"}
        }
        else if(car == -1){
            return {success:false, error:"Car not found"}
        }
        else{
            //old car is now available
            pg.editCar({stationId: data.pickupStation, carId: data.carId, carStatusId: 1});
            //new car is now reserved
            pg.editCar({stationId: newRes.pickupStationId, carId: car.carId, carStatusId: 3});
            newRes.carId = car.carid;
        }

    }

    const station2 = await pg.getStation(newRes.dropoffStationId);
    if(station2 == null || station2 == undefined){
        return {success:false, error: "dropoff station does not exist"}
    }
    if(station2 == -1){
        return {success:false, error: "dropoff station not found"}
    }
    if((newRes.dropoffTime != null && newRes.dropoffTime != undefined && newRes.pickupTime != null && newRes.dropoffTime != undefined) && (res.totalfees == null || res.totalfees == undefined)){
        newRes.totalFees = (await this.getReservePrice(auth, {pickupDateTime: newRes.pickupTime, dropoffDateTime: newRes.dropoffTime})).cost
    }
    else{
        newRes.totalFees = res.totalfees;
    }
    const pickupDate = new Date(newRes.pickupTime);
    const dropoffDate = new Date(newRes.dropoffTime);
    res = await pg.updateReservation(newRes)
    if(res == -1){
        return {success: false, error: "Failed to edit reservation"}
    }
    if(newRes.carId == null || newRes.carId == undefined){
        this.emailCustomer(cust.email, "GyroGoGo Reservation Created", `Your Gyrocar Reservation has been edited! Gyrocar Number will be emailed to you before your reservation.\nPickup: ${station1.stationname}, ${station1.address} at ${pickupDate.toLocaleString('en-US', {timezone: 'EST'})} \nDropoff: ${station2.stationname}, ${station2.address} at ${dropoffDate.toLocaleString('en-US', {timezone: 'EST'})}\n Confirmation Number: ${newRes.confirmationNumber}`)
    }
    else{
        this.emailCustomer(cust.email, "GyroGoGo Reservation Created", `Your Gyrocar Reservation has been edited! \nPickup: ${station1.stationname}, ${station1.address} at ${pickupDate.toLocaleString('en-US', {timezone: 'EST'})}\n Dropoff: ${station2.stationname}, ${station2.address} at ${dropoffDate.toLocaleString('en-US', {timezone: 'EST'})}\n Confirmation Number: ${newRes.confirmationNumber}\n Car Number:\n ${newRes.carId}`)
    }
    return {success: true}
}


async function getReservePrice(auth, data){
    if(!auth.validToken){
        return {error: "Invalid Authorization"}
    }
    if(data.pickupDateTime==null || data.pickupDateTime == undefined){
        return {error: "pickupDateTime must exist"}
    }
    if(data.dropoffDateTime==null || data.dropoffDateTime == undefined){
        return {error: "dropoffDateTime must exist"}
    }
    pickup = new Date(data.pickupDateTime)
    dropoff = new Date (data.dropoffDateTime)
    if(dropoff.valueOf() - pickup.valueOf() > 21600000){
        return {success: false, errorMessage: "Reservation pickup & dropoff must be within 6 hours of eachother."}
    }
    else {

        var hours = (dropoff.valueOf() - pickup.valueOf()) / 3600000

        var fees = await pg.getFeesByCity("Rochester")
        var total = hours * fees.hourlyrate

        if(total > fees.dailymaximum){
            total = parseFloat(fees.dailymaximum)
        }

        return {cost: total.toFixed(2)}
    }

}





module.exports = {
    getAllCustomers,
    getCustomerDetails,
    changeStatus,
    addStatus,
    getMessages,
    markMessageResolved,
    addMessage,
    getAllCars,
    getCarDetails,
    addCar,
    removeCar,
    updateCar,
    getWorkOrders,
    addWorkOrder,
    addStation,
    addEmployee,
    getAllEmployees,
    changeEmployeeStatus,
    getEmployeeDetails,
    getStateProvince,
    addStripeCustomer,
    deleteStripeCustomer,
    addPaymentMethod,
    emailCustomer,
    setupNewCustomerCard,
    getAvailableLocations,
    addReservation,
    getCustomerReservations,
    getReservationByID,
    deleteReservation,
    getReservePrice,
    editReservation
}