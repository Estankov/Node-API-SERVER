// @desc     Get all bootcamps
// @rout     GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({ sucess: true, msg: "Show all bootcamps"});
}

// @desc     Display a bootcamp
// @rout     GET /api/v1/bootcamps/:id
// @access   Public
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({ sucess: true, msg: `Display bootcamp ${req.params.id}`});
}

// @desc     Create a bootcamp
// @rout     POST /api/v1/bootcamps/:id
// @access   Private
exports.createBootcamp = (req, res, next) => {
    res.status(200).json({ sucess: true, msg: "Create new bootcamps"});
}

// @desc     Create a bootcamp
// @rout     PUT /api/v1/bootcamps/:id
// @access   Private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({ sucess: true, msg: `Update bootcamp ${req.params.id}`});
}

// @desc     Delete a bootcamp
// @rout     PUT /api/v1/bootcamps/:id
// @access   Private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({ sucess: true, msg: `Delete bootcamp ${req.params.id}`});
}