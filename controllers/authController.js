const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerController = async (req, res) => {

  try {
    const exisitingUser = await userModel.findOne({ email: req.body.email });
    //validation
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "User ALready exists",
      });
    }
    //hash password
    // console.log(req.body);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    //rest data
    const user = new userModel(req.body);
    await user.save();
    // return res.status(201).send({
    //   success: true,
    //   message: "User Registerd Successfully",
    //   user,
    // });
  } catch (error) {
    console.log("error in bcrypt", error);
    // res.status(500).send({
    //   success: false,
    //   message: "Error In Register API",
    //   error,
    // });
  }
  if(req.body.role==="patient"){
    res.redirect("/logP");
  }
   if(req.body.role==="donor"){
    res.redirect("/log");
  }
   if(req.body.role==="admin"){
    res.redirect("/logA");
  }

};


//middleware to find the user object locally
const userCreator=async(req,res,next)=>{
  const user= await userModel.find({email:req.cookies.email});
  if(!user)
  return next();
else{
  
  res.locals.user=user;
  next();}
  
}


//login

const loginController = async (req, res) => {

  try { 
    let user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid Credentials",
      });
    }
    //check role
    if (user.role !== req.body.role) {
      return res.status(500).send({
        success: false,
        message: "role dosent match",
      });
    }
    //compare password
    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!comparePassword) {
      return res.status(500).send({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const payload ={
            email:user.email,
            id:user.id,
            role:user.role,
        };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1d",});
    user=user.toObject();
    user.token=token;
    user.password=undefined;

    const options= {
         expires: new Date(Date.now() + 1*24*60*60*1000),
          httpOnly:true,
    }
    
    res.cookie("token" , token , options);

    res.cookie("email" ,user.email);
    
    // .status(200).json({
    //     success:true,
    //     token,
    //     user,
    //     message:"user logged in successfully",
    // });
    // return res.status(200).send({
    //   success: true,
    //   message: "Login Successfully",
    //   token,
    //   user,
    // });
  } catch (error) {
    console.log(error);
    // res.status(500).send({
    //   success: false,
    //   message: "Error In Login API",
    //   error,
    // });
  }
  if (req.body.role === 'admin') {
    const donors = await userModel?.find({ role: "donor" });
    const Alluser = await userModel?.find({});
    const totalDonor = donors?.length;

    // Calculate total donations and requests
    const donatedLengths = Alluser?.map(user => ({
        donatedLength: user.donated.filter(donation => donation.status !== 'rejected').length,
        requestedLength: user.Requested.filter(request => request.status !== 'rejected').length,
    }));

    const totalDonatedLength = donatedLengths?.reduce((total, length) => total + length.donatedLength, 0);
    const totalRequestedLength = donatedLengths?.reduce((total, length) => total + length.requestedLength, 0);
    const total = totalRequestedLength + totalDonatedLength;

    // Calculate total approved requests
    const approvedCounts = Alluser?.map(user => {
        const approvedInDonated = user?.donated?.filter(item => item.status === 'approved' || item.status === 'pending').length;
        const approvedInRequested = user?.Requested?.filter(item => item.status === 'approved' || item.status === 'pending').length;
        return approvedInDonated + approvedInRequested;
    });
    const totalapp = approvedCounts.reduce((total, count) => total + count, 0);

    // Calculate blood type quantities
    const bloodGroups = ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"];
    const bloodTypeQuantities = {};

    bloodGroups.forEach((group) => {
        bloodTypeQuantities[group] = 0;
    });

    Alluser.forEach((user) => {
        if (user.role === "donor") {
            user.donated.forEach((donation) => {
                if (donation.status !== 'rejected') {
                    bloodTypeQuantities[user.bloodGroup] += parseInt(donation.quantity);
                }
            });
        }
    });

    res.render('adminHome', { totalDonor, total, totalapp, bloodTypeQuantities });
}

 
  if(req.body.role ==='donor'){
     const user=res?.locals?.user[0]?.donated;
    //  console.log(user);
     const totalCount = user?.length;
     const pendingCount = user?.filter(request => request.status === 'pending').length;
     const approvedCount = user?.filter(request => request.status === 'approved').length;
     const rejectedCount = user?.filter(request => request.status === 'rejected').length;
    // , {totalCount , pendingCount , approvedCount, rejectedCount}
    res.render('donorHome' ,{totalCount , pendingCount , approvedCount, rejectedCount} );
  }

    if(req.body.role ==='patient'){ 
      const user=res?.locals?.user[0]?.Requested;
      //console.log(user);
    const totalCount = user?.length;
    const pendingCount = user?.filter(request => request.status === 'pending').length;
    const approvedCount = user?.filter(request => request.status === 'approved').length;
    const rejectedCount = user?.filter(request => request.status === 'rejected').length;
    res.render('patientHome',{totalCount , pendingCount , approvedCount, rejectedCount} );
    }
   
};


//sign-out
const signOutController = (req, res) => {
  console.log("logged out");
  try {
    // Clear the token cookie
    res.cookie("token",'');
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Error during sign-out',
      error,
    });
  }

};



module.exports={ registerController,loginController , signOutController,userCreator};


