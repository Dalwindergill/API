const express = require('express');
const router = express.Router({ mergeParams: true });
const coursesController = require('../controllers/courses');
const Course = require('../models/Course');
const advanceResults = require('../middlewares/advanceResults');

router.get(
  '/',
  advanceResults(Course, {
    path: 'bootcamp',
    select: 'name description',
  }),
  coursesController.getCoursesOfBootcamp
);
router.get('/:id', coursesController.getAllCourses);
router.post('/', coursesController.addCourse);
router.put('/:id', coursesController.updateCourse);
router.delete('/:id', coursesController.deleteCourse);

module.exports = router;
