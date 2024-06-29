const userModel = require("../models/userModel");
const donorRequest = async (req,res) =>{
    try{
        const {quantity,Disease} = req.body;
        const us = await userModel.findOne({email: req.us.email});
        us.donated.push({quantity,Disease});
        const response = await us.save();
        res.status(200).render('donorHist',{data:us.donated});
    }
    catch(err){
        console.error(err);
        console.log(err);
    }
   
};


const patientRequest = async (req,res) =>{
    try{
        const {quantity,reason} = req.body;
        const us = await userModel.findOne({email: req.us.email});

        us.Requested.push({quantity,reason});
        const response = await us.save();
        res.status(200).render('patientHist',{data:us.Requested});
    }
    catch(err){
        console.error(err);
        console.log(err);

    }
   
}


module.exports = { donorRequest ,patientRequest };