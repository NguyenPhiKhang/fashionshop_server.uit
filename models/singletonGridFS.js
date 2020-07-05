const mongoose = require('mongoose');

let instance = null;

class GridFSClass {

    constructor() {
     //this.value = Math.random(100)
    }

    // printValue() {
    //  console.log(this.value)
    // }

    static getInstance() {
     if(!instance) {
        instance = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: "photos"
        });
     }

     return instance;
    }
}

module.exports = GridFSClass