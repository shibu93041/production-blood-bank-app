const userModel = require("../models/userModel")

// get donor list
const getDonorListController = async (req, res) => {
    try {
        const donorData = await userModel
            .find({ role: 'donor' })
            .sort({ createdAt: -1 })

        return res.status(200).send({
            success: true,
            Totalcount: donorData.length,
            message: 'Donor List Fetched Successfully',
            donorData,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error in Donor List API',
        });
    }
};
// get Hospital List
const getHospitalListController = async (req, res) => {
    try {
        const hospitalData = await userModel
            .find({ role: 'hospital' })
            .sort({ createdAt: -1 })

        return res.status(200).send({
            success: true,
            Totalcount: hospitalData.length,
            message: 'Hospital List Fetched Successfully',
            hospitalData,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error in Hospital List API',
        });
    }
};
// get Organisation List
const getOrganisationListController = async (req, res) => {
    try {
        const organisationData = await userModel
            .find({ role: 'organisation' })
            .sort({ createdAt: -1 })

        return res.status(200).send({
            success: true,
            Totalcount: organisationData.length,
            message: 'Organisation List Fetched Successfully',
            organisationData,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error in Organisation List API',
        });
    }
};
// Delete Records
const deleteDonorController = async(req, res) =>{
    try {
        await userModel.findByIdAndDelete(req.params.id);
        return res.status(200).send({
            success:true,
            message:' Record Deleted Successfully',
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:'Error While Deleting ',
            error,
        });
    }
};



module.exports = {
    getDonorListController,
    getHospitalListController,
    getOrganisationListController,
    deleteDonorController,
}