const { parse } = require('csv-parse');
const fs = require('fs')
const path = require('path');

const planets = require('./planets.mongo');

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === "CONFIRMED"
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true,
            }))
            .on('data', async (chunk) => {
                if (isHabitablePlanet(chunk)) {
                    await savePlanet(chunk);
                }
            })
            .on('error', (err) => {
                console.log(err.message);
                reject(err);
            })
            .on('end', async () => {
                const habitablePlanets = await getAllPlanets();
                console.log('Habitable planets : \n', habitablePlanets.map((planet) => { return planet.keplerName }));
                console.log('total : ', habitablePlanets.length);
                resolve(habitablePlanets);
            });
    });
} 

async function savePlanet(planet) {
    // TODO: replace below create with insert + update = upsert
    // await planets.create({
    //     keplerName: planet.kepler_name,
    // }); // creating new document 
    try {
        await planets.updateOne({ // upsert 
            keplerName: planet.kepler_name, // if planet do not exists
        }, {
            keplerName: planet.kepler_name, // if planet doesnt exists
        }, {
            upsert: true, //  
        });
    } catch(err){
        console.log(`Could not save planet : ${err}`);
    }
}

async function getAllPlanets() {
    return await planets.find({},{
        '__v':0, // set a field zero to exclude it from the projection
        '_id':0,
    });
}

module.exports = {
    getAllPlanets,
    loadPlanetsData,
}

