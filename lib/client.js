'use strict';

const pg = require('pg');

// // DATABASE CONECCTION TO POSTGRES
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.log(err));

module.exports = client;
