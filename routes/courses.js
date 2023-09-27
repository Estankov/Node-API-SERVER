const express = require("express");
const { getCourses, getCourse, addCourse, updateCourese, deleteCourse } = require("../controllers/courses");

const router = express.Router({ mergeParams: true});

router.route('/').get(getCourses).post(addCourse);
router.route('/:id').get(getCourse).put(updateCourese).delete(deleteCourse);

module.exports = router;