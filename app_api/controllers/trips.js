const mongoose = require('mongoose');
//const Trip = require('../models/travlr'); // Register Model
const Trip = mongoose.model('trips');
const User = mongoose.model('users');

// GET: /trips - list all the trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async(req, res) => {
    Trip
        .find({}) //No filter, return all records
        .exec();

    // Uncomment the following line to show results of query
    // on the console
    //console.log(q);

    if(!q)
    { // Database returned no data
        return res
            .status(404)
            .json(err);
    } else { // Return resulting trip list
        return res
            .status(200)
            .json(q);
    }

};

// GET: /trips/:tripCode - lists a single trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsFindByCode = async(req, res) => {
    const q = await Trip
        .find({'code' : req.params.tripCode }) // Return single record
        .exec();

        //Uncomment following line to show results on console
        // console.log(q);
    
    if(!q)
    { // Database returned no data
        return res
            .status(404)
            .json(err);
    } else { // Return resulting trip list
        return res
            .status(200)
            .json(q);
    }
}

const getUser = (req, res, callback) => {
    if (req.payload && req.payload.email) {
        User
            .findOne({ email: req.payload.email })
                .exec((err, user) => {
                    if (!user) {
                        return res
                            .status(404)
                            .json({ "message": "User not found"});
                    } else if (err){
                        console.log(err);
                        return res
                            .status(404)
                            .json(err);
                    }
                    callback(req, res, user.name);
                });
    } else {
        return res
            .status(404)
            .json({ "message": "User not found" });
    }
}

// POST: /trips - Adds a new Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsAddTrip = async(req, res) => {
    console.log('tripsAddTrip invoked');
    getUser(req, res,
        (req,res) => {    
            Trip
                .create({
                    code: req.body.code,
                    name: req.body.name,
                    length: req.body.length,
                    start: req.body.start,
                    resort: req.body.resort,
                    perPerson: req.body.perPerson,
                    image: req.body.image,
                    description: req.body.description
                },
                    (err, trip) => {
                        if (err){
                            return res
                                .status(400) // bad request
                                .json(err);
                        } else {
                            return res
                                .status(201) // created
                                .json(trip);
                        }
                    }
            );

            
        }
    );    
}

// PUT: /trips/:tripCode - updates a Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsUpdateTrip = async(req, res) => {
    // Debugging calls
    console.log('TripsUpdateTrip invoked');
    console.log(req.params);
    console.log(req.body);

    getUser(req,res, 
        (req,res) => {
            Trip
                .findOneAndUpdate(
                    {'code': req.params.tripCode },
                    {
                        code: req.body.code,
                        name: req.body.name,
                        length: req.body.length,
                        start: req.body.start,
                        resort: req.body.resort,
                        perPerson: req.body.perPerson,
                        image: req.body.image,
                        description: req.body.description
                    }, {new: true}
                )
                .then(trip => {
                    if(!trip){
                        return res
                            .status(404)
                            .json({ "message": "Trip not found with code " 
                                + req.params.tripCode});
                    }
                    res.send(trip);
                }).catch(err => {
                    if (err.kind === 'ObjectId') {
                        return res
                            .status(404)
                            .json({ "message": "Trip not found with code " 
                                + req.params.tripCode});
                    }
                    return res
                        .status(500) // server error
                        .json(err);
                });
        }
    );
}

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    getUser
};