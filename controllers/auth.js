const path = require('path');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

//@desc Register user
//@route GET /api/v1/auth/register
// @access PUBLIC

exports.register = async (req, res, next) => {
    res.status(200).json({success:true})
}
