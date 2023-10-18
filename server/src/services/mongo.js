const mongoose = require('mongoose');

const MONGO_PASS = process.env.MONGO_PASS
const databaseName = 'nasa'
const MONGO_URL = `mongodb+srv://nasa-api:${MONGO_PASS}@nasacluster.elia6pz.mongodb.net/${databaseName}?retryWrites=true&w=majority`

mongoose.connection.on('open',()=>{ // mongoose.connection is an event emmiter
    console.log('MongoDB connection ready!');
})
.on('error', (err)=>{
    console.log(err.message);
});

async function mongoConnect(){
    await mongoose.connect(MONGO_URL); // connecting mongo db atlas 
}

async function mongoDisconnect(){
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
}