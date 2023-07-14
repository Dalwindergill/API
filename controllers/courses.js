const Course = require('../models/Course');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
// @desc   Get courses
// @route  GET /api/v1/courses
// @route  Get /api/v1/bootcamps/:bootcampId/courses
// @access Public

exports.getCoursesOfBootcamp = async (req, res, next) => {
  try {
    if (req.params.bootcampId) {
      let course = await Course.find({ bootcamp: req.params.bootcampId });

      if (course) {
        return res.status(200).json({ data: course });
      } else {
        next(err);
      }
    }
    res.status(200).json(res.advanceResult);
  } catch (err) {
    next(err);
  }
};

// @desc   Get single courses
// @route  GET /api/v1/course/:id
// @access Public

exports.getAllCourses = async (req, res, next) => {
  try {
    const data = await Course.findById(req.params.id).populate({
      path: 'bootcamp',
      select: 'name description',
    });

    if (!data) {
      new ErrorResponse(`No course with id of ${req.params.id}`, 404);
    }
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get single courses
// @route  POST /api/v1/bootcamps/:bootcampId/courses
// @access Private

exports.addCourse = async (req, res, next) => {
  try {
    req.body.bootcamp = req.params.bootcampId;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
      return next(
        new ErrorResponse(`No course with id of ${req.params.id}`, 404)
      );
    }

    const data = await Course.create(req.body);
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Update courses
// @route  PUT /api/v1/courses/:id
// @access Private

exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return next(
        new ErrorResponse(`No course with id of ${req.params.id}`, 404)
      );
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Delete courses
// @route  DELETE /api/v1/courses/:id
// @access Private

exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(
        new ErrorResponse(`No course with id of ${req.params.id}`, 404)
      );
    }
    await course.remove;
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
