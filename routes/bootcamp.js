const express = require('express');
const router = express.Router();
const bootcampController = require('../controllers/bootcamps');
const courses = require('./courses');
const Bootcamp = require('../models/Bootcamp');
const advanceResults = require('../middlewares/advanceResults');

router.use('/bootcamps/:bootcampId/courses', courses);

router.get(
  '/bootcamps',
  advanceResults(Bootcamp, 'courses'),
  bootcampController.getAllBootcamps
);
router.get('/bootcamps/query', bootcampController.getBootcampWithQuery);
router.get(
  '/bootcamps/radius/:zipcode/:distance',
  bootcampController.getBootcampInRadius
);
router.get('/bootcamps/:id', bootcampController.getAllBootcamps);
router.post('/bootcamps/:id', bootcampController.NewBootcamps);
router.put('/bootcamps/:id', bootcampController.updateBootcamps);
router.delete('/bootcamps/:id', bootcampController.deleteBootcamps);
router.put('/bootcamps/:id/photo', bootcampController.bootcampPhotoUpload);

module.exports = router;
