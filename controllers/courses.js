const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const errorHandler = require('../middleware/error');

// @desc     Get courses
// @rout     GET /api/v1/courses
// @rout     GET /api/v1/bootcamps/:bootcampId/courses
// @access   Public
exports.getCourses = asyncHandler( async (req, res, next) => {

    if(req.params.bootcampId) {
        const courses = await Course.find({bootcamp: req.params.bootcampId });

        return res.status(200).josn({
            sucess:true,
            count: courses.length,
            data: courses
        })
    } else {
       res.status(200).json(res.advancedResults);
    }

});

// @desc     Get single course
// @rout     GET /api/v1/courses/:id
// @access   Public
exports.getCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404);
    }

    res.status(200).json({
        sucess: true,
        data: course
    });

});

// @desc     Add course
// @rout     POST /api/v1/bootcamps/:bootcampid/courses
// @access   Public
exports.addCourse = asyncHandler(async(req, res, next) => {

    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`), 404);
    }

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course to ${bootcamp._id}`), 401);
    }

    const course = await Course.create(req.body);

    res.status(200).json({
        sucess: true,
        data: course
    });
});

// @desc     Update course
// @rout     PUT /api/v1/courses/:id
// @access   Public
exports.updateCourese = asyncHandler(async(req, res, next) => {

    let course = await Course.findById(req.params.id);

    if(!course){
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`));
    }

    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update course ${course._id}`), 401);
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        sucess: true,
        data: course
    });

});

// @desc     Delete course
// @rout     DELETE /api/v1/courses/:id
// @access   Public
exports.deleteCourse = asyncHandler(async(req, res, next) => {

    const course = await Course.findById(req.params.id);

    if(!course){
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404);
    }

    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete course ${course._id}`), 401);
    }


    await course.deleteOne();

    res.status(200).json({
        sucess: true,
        data: {}
    });

});