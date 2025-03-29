const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

const createInventoryController = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error("User Not Found");
        }
        // if(inventoryType === "in" && user.role !== "donor"){
        //     throw new Error("Not a Donor Account");  
        // }
        // if(inventoryType === "out" && user.role !== "hospital"){
        //     throw new Error("Not a Hospital");
        // }

        if (req.body.inventoryType == 'out') {
            const requestBloodGroup = req.body.bloodGroup
            const requestQuantityOfBlood = req.body.quantity
            const organisation = new mongoose.Types.ObjectId(req.body.userId)

            // calculate blood Quantity
            const totalInOfRequestedBlood = await inventoryModel.aggregate([
                {
                    $match: {
                        organisation,
                        inventoryType: 'in',
                        bloodGroup: requestBloodGroup,
                    }
                }, {
                    $group: {
                        _id: '$bloodGroup',
                        total: { $sum: '$quantity' },
                    },
                },
            ]);
            // console.log("Total In", totalInOfRequestedBlood);
            const totalIn = totalInOfRequestedBlood[0]?.total || 0;

            // Calculate  OUT blood 
            const totalOutOfRequestBloodGroup = await inventoryModel.aggregate([
                {
                    $match: {
                        organisation,
                        inventoryType: 'out',
                        bloodGroup: requestBloodGroup,
                    }
                }, {
                    $group: {
                        _id: '$bloodGroup',
                        total: { $sum: '$quantity' }
                    },
                },
            ]);
            const totalOut = totalOutOfRequestBloodGroup[0]?.total || 0;

            // in & out calculate
            const availableQuantityOfBloodGroup = totalIn - totalOut;
            // Quantity validation
            if (availableQuantityOfBloodGroup < requestQuantityOfBlood) {
                return res.status(500).send({
                    success: false,
                    message: `only ${availableQuantityOfBloodGroup}ML of ${requestBloodGroup.toUpperCase()} is available`
                });
            }
            req.body.hospital = user?._id;

        } else {
            req.body.donor = user?._id;
        }

        // save Record
        const inventory = new inventoryModel(req.body);
        await inventory.save();
        return res.status(201).send({
            success: true,
            message: 'New Blood Record Added',
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Create Inventory API',
            error,
        });

    }
};
// get all blood records
const getInventoryController = async (req, res) => {
    try {
        const inventory = await inventoryModel.find({ organisation: req.body.userId, }).populate('donor').populate('hospital').sort({ createdAt: -1 })
        return res.status(200).send({
            success: true,
            message: 'Get All Records Successfully',
            inventory,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error in Get All Inventory',
            error,
        });

    }
};

// Get Donor Record
const getDonorsController = async (req, res) => {
    try {
        const organisation = req.body.userId
        // find donors
        const donorId = await inventoryModel.distinct("donor", {
            organisation,
        });
        // console.log(donorId);
        const donors = await userModel.find({ _id: { $in: donorId } })

        return res.status(200).send({
            success: true,
            message: "Donor Record Featched Successfully",
            donors,
        });

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error in Donor Records',
            error,
        });
    };
};

// get Hospital Record
const getHospitalsController = async (req, res) => {
    try {
        const organisation = req.body.userId;
        // Get Hospital ID
        const hospitalId = await inventoryModel.distinct('hospital', { organisation });
        // Find Hospital
        const hospitals = await userModel.find({
            _id: { $in: hospitalId }
        })
        return res.status(200).send({
            success: true,
            message: "Hospitals Data Featched Successfully",
            hospitals,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Get Hospital API",
            error,
        });
    }
};

// get organisation Record
const getOrganisationController = async (req, res) => {
    try {
        const donor = req.body.userId;
        const orgId = await inventoryModel.distinct('organisation', { donor });
        // find organisation
        const organisations = await userModel.find({
            _id: { $in: orgId }
        })
        return res.status(200).send({
            success: true,
            message: 'Organisation Data Featched Successfully',
            organisations,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error In Get Organisation API',
            error,
        });
    }
};
// get organisation for hospital Record
const getOrganisationForHospitalController = async (req, res) => {
    try {
        const hospital = req.body.userId;
        const orgId = await inventoryModel.distinct('organisation', { hospital });
        // find organisation
        const organisations = await userModel.find({
            _id: { $in: orgId }
        });
        return res.status(200).send({
            success: true,
            message: 'Hospital Organisation Data Featched Successfully',
            organisations,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error In Hospital Organisation API',
            error,
        });
    }
};

// Get Hospital Blood Records
const getInventoryHospitalController = async (req, res) => {
    try {
        const inventory = await inventoryModel
        .find(req.body.filters)
        .populate('donor')
        .populate('hospital')
        .populate('organisation')
        .sort({ createdAt: -1 })
        return res.status(200).send({
            success: true,
            message: 'Get Hospital Consumer Records Successfully',
            inventory,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error In Get Consumer Inventory',
            error,
        });

    }
};
// Get Blood Record Of 3
const getRecentInventoryController = async (req, res) =>{
    try {
        const inventory = await inventoryModel.find({
            organisation:req.body.userId 
        }).limit(3).sort({createdAt: -1});
        return res.status(200).send({
            success:true,
            message:'Recent Inventory Data',
            inventory,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:'Error In Recent Inventory API',
            error,
        });
    }
};

module.exports = {
    createInventoryController,
    getInventoryController,
    getDonorsController,
    getHospitalsController,
    getOrganisationController,
    getOrganisationForHospitalController,
    getInventoryHospitalController,
    getRecentInventoryController,
};