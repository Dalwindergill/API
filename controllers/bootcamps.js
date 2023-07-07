// @desc    GET ALL BOOTCAMPS
// @route   GET  /api/v1/bootcamps
// @acesss  PUBLIC

const bootcamp = require('../models/Bootcamp');

exports.getAllBootcamps = async (req, res, next) => { 
  if (!req.params.id) {
    try {
      const data = await bootcamp.find();
      res.send(data);
    } catch (err) {
      console.log(err.message);
      res.send({
        success: false,
        msg: `Failed`,
      });
    }
  } else {
    try {
      const data = await bootcamp.find({ _id: req.params.id });
      if (!bootcamp) {
        return res.send({
          success: false,
          msg: `Failed`,
        });
      }
      res.send(data);
    } catch (err) {
      console.log(err.message);
      res.send({
        success: false,
        msg: `Failed`,
      });
    }
  }
};
// @desc    Create a new BOOTCAMPS with a new id.
// @route   POST  /api/v1/bootcamps/id
// @acesss  PUBLIC

exports.NewBootcamps = async (req, res, next) => {
  console.log(typeof req.body);
  try {
    const data = await bootcamp.insertMany(req.body);
    res.json({
      success: true,
      msg: data,
    });
  } catch (err) {
    console.log(err.message);
    res.status(401).json({
      success: false,
      msg: `Failed`,
    });
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
    return res.status(404).json({
      success: false,
      msg: `Failed`,
    });
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
