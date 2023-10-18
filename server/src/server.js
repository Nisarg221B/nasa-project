const http = require('http');

// keep the below line on top so that .env variables are accessable to all modules imported below
require('dotenv').config(); // configuring env

const { mongoConnect } = require('./services/mongo');
const app = require('./app'); // seperating the express code 
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);


async function startServer(){
    await mongoConnect();
    await loadPlanetsData(); 
    await loadLaunchData();

    // starting the server 
    server.listen(PORT,()=>{
        console.log(`listening on port ${PORT}...`);
    })
};

startServer();
