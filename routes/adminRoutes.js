const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { getDonorListController,
    getHospitalListController,
    getOrganisationListController,
    deleteDonorController,
    updateDonorController,
} = require('../controllers/adminController');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Router Object 
const router = express.Router();

// routes

// get || donor list
router.get('/donor-list', authMiddleware, adminMiddleware, getDonorListController);

// get || Hospital list
router.get('/hospital-list', authMiddleware, adminMiddleware, getHospitalListController);

// get || Organisation list
router.get('/organisation-list', authMiddleware, adminMiddleware, getOrganisationListController);

// Delete Donor ||Get 
router.delete('/delete-donor/:id',authMiddleware, adminMiddleware, deleteDonorController )

module.exports = router;
