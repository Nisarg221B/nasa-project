const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL

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