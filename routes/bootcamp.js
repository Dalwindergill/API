const express = require('express');
const router = express.Router();
const bootcampController = require('../controllers/bootcamps');

router.get('/bootcamps', bootcampController.getAllBootcamps);
router.get('/bootcamps/:id', bootcampController.getAllBootcamps);
router.post('/bootcamps/:id', bootcampController.NewBootcamps);
router.put('/bootcamps/:id', bootcampController.updateBootcamps);
router.delete('/bootcamps/:id', bootcampController.deleteBootcamps);

module.exports = router;
