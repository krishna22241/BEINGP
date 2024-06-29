const JWT = require("jsonwebtoken");
require("dotenv").config();
exports.isMiddleware = async (req, res, next) => {
  try {
    
    const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");

    if(!token || token === undefined){
            return res.status(401).json({
                success:false,
                message:'token missing',
            });
    }

        //verify the token
        try{
            const decode = JWT.verify(token, process.env.JWT_SECRET);
            // data = {...decode}
             //console.log(data)
            req.us = decode;
        }catch(error){
            return res.status(401).json({
                success:false,
                message:'token invalid',
            }); 
        }
    next();

  }
  catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      error,
      message: "Auth Failed",
    });
  }
};

//authorisation
exports.isDonor = (req,res,next) =>{
    try{
        if(req.us.role !== "donor"){
            return res.status(401).json({
                success:false,
                message:'this is a protected route for donor',
            });
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'donor role is not matching',
        });
    }
}

exports.isAdmin = (req,res,next) =>{
    try{
        if(req.us.role!=="admin"){
            return res.status(401).json({
                success:false,
                message:'this is a protected route for admin',
            });
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'admin role is not matching',
        });
    }
}

exports.isPatient = (req,res,next) =>{
    try{
        if(req.us.role!=="patient"){
            return res.status(401).json({
                success:false,
                message:'this is a protected route for patient',
            });
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'patient role is not matching',
        });
    }
}