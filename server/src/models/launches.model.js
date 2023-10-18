const axios = require('axios');

const launchesMongo = require('./launches.mongo');
const planets = require('./planets.mongo'); // for maintaining refrential integrity

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

// const launch = {
//     flightNumber: 100, // flight_number
//     mission: 'Kepler Exploration X', // name
//     rocket: "Explorer IS1", // rocket.name
//     launchDate: new Date('December 23, 2030'), // date_local
//     target: "kepler-442 b", // not applicable 
//     customers: ['ZTM', 'NASA'], // payload.customers for each payload 
//     upcoming: true, // upcomming
//     success: true, // success
// }

async function getLatestFlightNumber() {
    const latestLaunch = await launchesMongo
        .findOne()
        .sort('-flightNumber'); // sorting in descending order -

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
    // return Array.from(launches.values());
    return await launchesMongo
        .find({}, { '_id': 0, '__v': 0, })
        .sort({ flightNumber: 1 }) // 1 for assending  , -1 for descending
        .skip(skip) // 20
        .limit(limit); // 50
    // returns 50 documents after we skip 20 
}

async function saveLaunch(launch) {
    try {
        // findOne also returns a new property named "$setonInsert" if the 
        // object is not already present
        // thus use findOneAndUpdate which only returns the properties we set in our update 
        await launchesMongo.findOneAndUpdate({
            flightNumber: launch.flightNumber,
        }, launch, {
            upsert: true,
        });
    } catch (err) {
        throw err;
    }
}

async function populateLunches() {
    console.log("downloading launch data from spaceX api");
    const response = await axios.post(SPACEX_API_URL, {
        "query": {},
        "options": {
            "pagination": false,
            "populate": [
                {
                    "path": "rocket",
                    "select": "name"
                },
                {
                    "path": "payloads",
                    "select": {
                        "customers": 1
                    }
                }
            ]
        }
    });
    if (response.status !== 200) {
        throw new Error('Problem downloading launch data');
    }
    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        });

        const launch = {
            flightNumber: launchDoc.flight_number,
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,
        };
        // console.log(`${launch.flightNumber} , ${launch.mission}`);
        await saveLaunch(launch);
    }
}

async function loadLaunchData() {

    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    });
    if (firstLaunch) {
        console.log('Launch data already loaded!');
    } else {
        populateLunches();
    }

}

async function findLaunch(filter) {
    return await launchesMongo.findOne(filter);

}

async function existsLaunchWithId(launchId) {
    return await findLaunch({
        flightNumber: launchId,
    });
}

async function scheduleNewLaunch(launch) {
    try {
        const planet = await planets.findOne({ // for referential integrity
            keplerName: launch.target,
        });

        if (!planet) { // for referential integrity
            throw new Error('No matching planet found');
        }

        const newFlightNumber = await getLatestFlightNumber() + 1;

        const newLaunch = Object.assign(launch, {
            flightNumber: newFlightNumber,
            success: true,
            upcoming: true,
            customers: ['ZTM', 'NASA'],
        });
        await saveLaunch(newLaunch);
    } catch (err) {
        throw err;
    }
}

async function abortLaunchById(launchId) {
    const aborted = await launchesMongo.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false,
    }); // no need to pass upsert as we know that document do exist 
    console.log(aborted);
    return (aborted.acknowledged === true && aborted.modifiedCount === 1);
}

module.exports = {
    getAllLaunches,
    loadLaunchData,
    existsLaunchWithId,
    scheduleNewLaunch,
    abortLaunchById,
}