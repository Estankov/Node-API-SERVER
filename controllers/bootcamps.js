const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

const geocoder = require('../utils/geocoder');

// @desc     Get all bootcamps
// @rout     GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    
    const bootcamps = await Bootcamp.find();
    res.status(200).json({
        sucess: true, 
        count: bootcamps.length,
        data: bootcamps
    })

});

// @desc     Display a bootcamp
// @rout     GET /api/v1/bootcamps/:id
// @access   Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(201).json({
        sucess: true, 
        data: bootcamp
    })

});

// @desc     Create a bootcamp
// @rout     POST /api/v1/bootcamps/:id
// @access   Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        sucess: true,
        data: bootcamp
    })

});

// @desc     Create a bootcamp
// @rout     PUT /api/v1/bootcamps/:id
// @access   Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        sucess: true,
        data: bootcamp
    })

});

// @desc     Delete a bootcamp
// @rout     PUT /api/v1/bootcamps/:id
// @access   Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
        sucess: true,
        data: {}
    })


});

// @desc     Get bootcamps within a radius
// @rout     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access   Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {

    const { zipcode, distance } = req.params;
    

    //Get Lat/lgn from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lgn = loc[0].longitude;

    // Calc radius using radians
    // Divide distance by radius of Earth
    // Earth radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: {$centerSphere: [ [ lgn, lat], radius ]} }
    });

    res.status(200).json({
        sucess: true,
        count: bootcamps.length,
        data: bootcamps
    })

});
