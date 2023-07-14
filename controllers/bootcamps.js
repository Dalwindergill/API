// @desc    GET ALL BOOTCAMPS
// @route   GET  /api/v1/bootcamps
// @acesss  PUBLIC
const bootcamp = require('../models/Bootcamp');
const path = require('path');
const geocoder = require('../utils/geocoder');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');

exports.getAllBootcamps = async (req, res, next) => {
  if (!req.params.id) {
    try {
    res.status(200).json(res.advanceResult);
    } catch (err) {
      next(err);
      // res.send({
      //   success: false,
      //   msg: `Failed`,
      // });
    }
  } else {
    try {
      const data = await bootcamp.find({ _id: req.params.id });

      if (!bootcamp) {
        return next(err);
        //res.send({
        //   success: false,
        //   msg: `Failed`,
        // });
      }
      res.send(data);
    } catch (err) {
      // res.send({
      //   success: false,
      //   msg: `Failed`,
      // });

      next(err);
    }
  }
};
// @desc    Create a new BOOTCAMPS with a new id.
// @route   POST  /api/v1/bootcamps/id
// @acesss  PUBLIC

exports.NewBootcamps = async (req, res, next) => {
  try {
    const data = await bootcamp.create(req.body);
    res.json({
      success: true,
      msg: data,
    });
  } catch (err) {
    next(err);
    // res.status(401).json({
    //   success: false,
    //   msg: `Failed`,
    // });
  }
};
// @desc    UPDATE a BOOTCAMPS
// @route   PUT  /api/v1/bootcamps/id
// @acesss  PUBLIC

exports.updateBootcamps = async (req, res, next) => {
  const data = await bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(err);
    // res.status(404).json({
    //   success: false,
    //   msg: `Failed`,
    // });
  }
  res.status(200).json({ data });
};

// @desc    DELETE A BOOTCAMPS
// @route   GET  /api/v1/bootcamps/id
// @acesss  PUBLIC

exports.deleteBootcamps = async (req, res, next) => {
  const data = await bootcamp.findById({ _id: req.params.id });
  data.remove();
  if (!data) {
    return res.status(404).json({ success: false, msg: `Failed` });
  }
  res.status(200).json(data);
};

// @desc    GET a bootcamp in a radius
// @route   GET  /api/v1/bootcamps/radius/zipcode/distance     (distance in miles)
// @acesss  PUBLIC

exports.getBootcampInRadius = async (req, res, next) => {
  try {
    const { zipcode, distance } = req.params;
    const loc = await geocoder.geocode(zipcode);
    console.log(loc);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // calculating radius
    const radius = distance / 3963;
    const bootCamp = await Bootcamp.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    res.status(200).json({
      success: true,
      msg: bootCamp,
    });
  } catch (err) {
    next(err);
    // res.status(401).json({
    //   success: false,
    //   msg: `Failed`,
    // });
  }
};

exports.getBootcampWithQuery = async (req, res, next) => {
  try {
    res.status(200).json(res.advanceResults);
  } catch (err) {
    next(err);
    // res.status(401).json({
    //   success: false,
    //   msg: `Failed`,
    // });
  }
};

// @desc    Upload photo for a bootcamp
// @route   PUT  /api/v1/bootcamps/:id/photo
// @acesss  PUBLIC

exports.bootcampPhotoUpload = async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  const file = req.files.file;

  // Check if it is a image or any other format

  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }
  // Check file size

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image file lessthan ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Rename the image

  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  console.log(file.name);

  // saving file
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`)), 500;
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })
    res.status(200).json({
      success: true,
      data:file.name
    })
  });
};
