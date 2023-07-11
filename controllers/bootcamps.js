// @desc    GET ALL BOOTCAMPS
// @route   GET  /api/v1/bootcamps
// @acesss  PUBLIC
const bootcamp = require('../models/Bootcamp');
const geocoder = require('../utils/geocoder');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');

exports.getAllBootcamps = async (req, res, next) => {
  if (!req.params.id) {
    try {
      const data = await bootcamp.find();

      res.send(data);
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
  const data = await bootcamp.deleteOne({ _id: req.params.id });

  if (!bootcamp) {
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
    let query;
    
    const reqQuery = { ...req.query }
    
    const removeFields = ['select','sort']
    
    removeFields.forEach(param => delete reqQuery[param])
    
    let queryStr = JSON.stringify(reqQuery);
    queryStr = JSON.stringify(reqQuery)
    
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=> `$${match}`)

    query = Bootcamp.find(JSON.parse(queryStr));

    if (req.query.select)
    {
      const fields = req.query.select.split(',').join(' ');
      query=query.select(fields)
    }

    if (req.query.sort)
    {
      const sortBy = req.query.sort.split(',').join(' ')
      query=query.sort(sortBy)
    }
    else {
      query=query.sort('-createdAt')
    }

    const data=await query

    
    res.status(200).json({
      success: true,
      count: data.length,
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
