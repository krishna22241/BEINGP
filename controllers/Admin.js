const userModel = require("../models/userModel");


const getDonorDetailsController = async (req, res) => {
   try {
   const donors = await userModel.find({ role: "donor" }).select("name email bloodGroup  address phone");
     res.render('admin_donor',{donors});
  }
   catch (error) {
  }
};


const getDonorDetailsCountController = async (req, res) => {
   try {
    const donors = await userModel?.find({ role: "donor" });
    const patient = await userModel?.find({role:"patient"});

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
        else if(user.role === "patient"){
          user.Requested.forEach((request) => {
            if (request.status !== 'rejected' && request.status!== 'pending') {
              bloodTypeQuantities[user.bloodGroup] -= parseInt(request.quantity);
              }
              });
        }
    });

    res.render('adminHome', { totalDonor, total, totalapp, bloodTypeQuantities });
  }
  catch (error) {
    
  }
};


const getPatientDetailsController = async (req , res) => {
   try {
    const donors = await userModel.find({ role: "patient" }).select("name email bloodGroup  address phone");

    res.render('admin_patient',{donors});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getAllDonorRequests = async (req, res) => {
  try {
    
    const donorsWithRequests = await userModel
      .find({ role: "donor" })
      .populate("donated");

    const donorRequests = donorsWithRequests.reduce((allRequests, donor) => {
      return allRequests.concat( 
          donor.donated.map((donation) => ({
          donorId:donor._id,
          donationId: donation._id,
          donorName: donor.name,
          donorBloodGroup: donor.bloodGroup,
          donationQuantity: donation.quantity,
          donationDisease: donation.Disease,
          donationStatus: donation.status,
          donationDate: donation.date,
        }))
      );
    }, []);

    res.render('admin_donationsD' , {donorRequests } );

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in getAllDonorRequests API",
      error: error.message,
    });
  }
};



const getAllPatientRequests = async (req, res) => {
  try {
    
    const patientsWithRequests = await userModel
      .find({ role: "patient" })
      .populate("Requested");

    const patientRequests = patientsWithRequests.reduce((allRequests, patient) => {
      return allRequests.concat(
        patient.Requested.map((request) => ({
          patientId:patient._id,
          PatientReqId:request._id,
          PatientStatus:request.status,
          patientName: patient.name, 
          patientEmail: patient.email,
          patientBloodGroup: patient.bloodGroup,
          requestQuantity: request.quantity,
          requestReason: request.reason,
          requestStatus: request.status,
          requestDate: request.date,
        }))
      );
    }, []);

    // res.status(200).json({
    //   success: true,
    //   data: patientRequests,
    //   message: "All patient requests retrieved successfully",
    // });
    res.render('admin_requestsP',{patientRequests});
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in getAllPatientRequests API",
      error: error.message,
    });
  }
};


const deleteDonorController = async (req, res) => {
   try {

    const userIdToDelete = req.body.donorId;
 
    
    const updatedUser =  await userModel.findOneAndDelete({ _id: userIdToDelete });
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.redirect('/adminD');
    // res.status(200).json({
    //   success: true,
    //   message: 'Donor deleted successfully',
    //   updatedUser,
    // });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error deleting donor',
      error: error.message,
    });
  }
};

const deletePatientController = async (req, res) => {
   try {

    const userIdToDelete = req.body.donorId;
    const updatedUser =  await userModel.findOneAndDelete({ _id: userIdToDelete });
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.redirect('/adminP');
    // res.status(200).json({
    //   success: true,
    //   message: 'Donor deleted successfully',
    //   updatedUser,
    // });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error deleting donor',
      error: error.message,
    });
  }
};

const changeStatusController = async (req, res) => {
  try {
    // console.log('Request received:', req.body);
    const { donorId } = req.body;

    // Find the user by donorId
    const user = await userModel.findById(donorId);
    
    if (!user) {
      // console.log('User not found:', donorId);
      return res.status(404).json({ 
        success: false,
        message: 'User not found',
      });
    }

    // Update the status of the specific donation within the donated array
    const donationIndex = user.donated.findIndex(donation => donation._id.toString() === req.body.donationId);
    if (donationIndex !== -1) {
      user.donated[donationIndex].status = req.body.status;
      await user.save();
      // console.log('Status updated for donation:', user.donated[donationIndex]);
    } else {
      // console.log('Donation not found:', req.body.donationId);
      return res.status(404).json({ 
        success: false,
        message: 'Donation not found',
      });
    }

    res.redirect('/adminDR');
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating donation status',
      error: error.message,
    });
  }
};

const rejectStatusController = async (req, res) => {
  try {
    console.log('Request received:', req.body);
    const { donorId } = req.body;

    // Find the user by donorId
    const user = await userModel.findById(donorId);
    
    if (!user) {
      console.log('User not found:', donorId);
      return res.status(404).json({ 
        success: false,
        message: 'User not found',
      });
    }

    // Update the status of the specific donation within the donated array
    const donationIndex = user.donated.findIndex(donation => donation._id.toString() === req.body.donationId);
    if (donationIndex !== -1) {
      user.donated[donationIndex].status = req.body.status;
      await user.save();
      console.log('Status updated for donation:', user.donated[donationIndex]);
    } else {
      console.log('Donation not found:', req.body.donationId);
      return res.status(404).json({ 
        success: false,
        message: 'Donation not found',
      });
    }

    res.redirect('/adminDR');
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating donation status',
      error: error.message,
    });
  }
};

const changePatientReqStatusController = async (req, res) => {
  try {
    // console.log('Request received:', req.body);
    const { patientId } = req.body;

    // Find the user by donorId
    const user = await userModel.findById(patientId);
    
    if (!user) {
      // console.log('User not found:', donorId);
      return res.status(404).json({ 
        success: false,
        message: 'User not found',
      });
    }

    // Update the status of the specific donation within the donated array
    const requestedIndex = user.Requested.findIndex(request => request._id.toString() === req.body.PatientReqId);
    if (requestedIndex !== -1) {
      user.Requested[requestedIndex].status = req.body.status;
      await user.save();
      // console.log('Status updated for donation:', user.donated[donationIndex]);
    } else {
      // console.log('Donation not found:', req.body.donationId);
      return res.status(404).json({ 
        success: false,
        message: 'Request not found',
      });
    }

    res.redirect('/adminPR');
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating donation status',
      error: error.message,
    });
  }
};

const rejectPatientStatusController = async (req, res) => {
  try {
    // console.log('Request received:', req.body);
    const { patientId } = req.body;

    // Find the user by donorId
    const user = await userModel.findById(patientId);
    
    if (!user) {
      // console.log('User not found:', donorId);
      return res.status(404).json({ 
        success: false,
        message: 'User not found',
      });
    }

    // Update the status of the specific donation within the donated array
    const requestedIndex = user.Requested.findIndex(request => request._id.toString() === req.body.PatientReqId);
    if (requestedIndex !== -1) {
      user.Requested[requestedIndex].status = req.body.status;
      await user.save();
      // console.log('Status updated for donation:', user.donated[donationIndex]);
    } else {
      // console.log('Donation not found:', req.body.donationId);
      return res.status(404).json({ 
        success: false,
        message: 'Request not found',
      });
    }

    res.redirect('/adminPR');
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating donation status',
      error: error.message,
    });
  }
};

module.exports = { getDonorDetailsController,deletePatientController, getPatientDetailsController ,getAllDonorRequests,getAllPatientRequests,deleteDonorController , getDonorDetailsCountController,changeStatusController,rejectStatusController,changePatientReqStatusController,rejectPatientStatusController};




