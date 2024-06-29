const userModel = require('../models/userModel');
const totalRequest = async (req,res) =>{
    try{
        const us = await userModel.findOne({email:req.cookies.email});
        const totalCount = await us.donated.length;
        return res.status(200).json({
            success:true,
            totalCount,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"error in fetching the total Requests",
            error
        })
    }
}

const pendingRequest = async (req,res) =>{
try{
     const us = await userModel.findOne({email:req.cookies.email});
     const pendingCount = us.donated.filter(request => request.status === 'pending').length;
     return pendingCount;
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"error in counting pending requests",
            error,
        })
    }
}
const approvedRequest = async (req,res) =>{
    try{
        const us = await userModel.findOne({email:req.cookies.email});
        const approvedCount = us.donated.filter(request => request.status === 'approved').length;
        return approvedCount;
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"error in counting approved requests",
            error,
        })
    }
}

const rejectedRequest = async (req,res) =>{
    try{
        const us = await userModel.findOne({email:req.cookies.email});
        const rejectedCount = us.donated.filter(request => request.status === 'rejected').length;
        return rejectedCount;
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"error in counting rejected requests",
            error,
        })
    }
}

module.exports = {totalRequest,pendingRequest,approvedRequest,rejectedRequest};
























































