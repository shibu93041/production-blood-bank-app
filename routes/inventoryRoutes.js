const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createInventoryController,
    getInventoryController,
    getDonorsController,
    getHospitalsController,
    getOrganisationController,
    getOrganisationForHospitalController,
    getInventoryHospitalController,
    getRecentInventoryController,
} = require('../controllers/inventoryController');

const router = express.Router();

// /routes
// add inventory

router.post('/create-inventory', authMiddleware, createInventoryController);


// get Recent Blood records
router.get('/get-recent-inventory', authMiddleware, getRecentInventoryController);

// get all Blood records
router.get('/get-inventory', authMiddleware, getInventoryController);

// get Hospital Blood records
router.post('/get-inventory-hospital', authMiddleware, getInventoryHospitalController);

// get  Donor records
router.get('/get-donors', authMiddleware, getDonorsController);

// get  Hospital records
router.get('/get-hospitals', authMiddleware, getHospitalsController);

// get  Organisation records
router.get('/get-organisation', authMiddleware, getOrganisationController);

// get  Organisation records
router.get('/get-organisation-for-hospital', authMiddleware, getOrganisationForHospitalController);




module.exports = router;