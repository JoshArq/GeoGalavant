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