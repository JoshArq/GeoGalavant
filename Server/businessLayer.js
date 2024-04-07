const pg = require('./postGalavant.js');
require('dotenv').config()

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
    //console.log(car);
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

async function getWorkOrders(auth){
    if(!auth.validToken){
        return {error: "invalid authorization"}
    }
    let workOrders = await pg.getMaintenance();
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
    console.log(maintenanceId);
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
    console.log(stationId);
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
    getEmployeeDetails
}