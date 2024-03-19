//This serves as a unit testing file for our Data Layer
//https://www.w3schools.com/nodejs/ref_assert.asp

const assert = require('assert');
const pg = require('./postGalavant.js')


async function main(){ 
    pg.pulseCheck()
    // console.log(await pg.login("bbb", "bbb"))
    // console.log(await pg.login("aaa", "bbb")) 
    // console.log(pg.login("max123", "password"))
}

main()