const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
    quantity: {
      type: String,
      required: true,
    },
    Disease:{
      type:String,
      required:true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    date: {
      type: Date,
      default: Date.now()
    }
});

const patientSchema = new mongoose.Schema({
    quantity: {
      type: String,
      required: true,
    },
    reason:{
      type:String,
      required:true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    date: {
      type: Date,
      default: Date.now()
    }
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required:true,
      trim:true,
    },
     email: {
      type: String,
      required: [true, "email is required"],
      trim:true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    bloodGroup: {
      type: String,
      required: function(){
        if(this.role ==="donor" || this.role==="patient"){
          return true;
        }
        return false;
      },
      enum: ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"],
    },
    Age:{
      type:String,
      required: function(){
        if(this.role ==="donor" || this.role==="patient"){
          return true;
        }
        return false;
      },
    },
    address: {
      type: String,
      required: function(){
        if(this.role ==="donor" || this.role==="patient"){
          return true;
        }
        return false;
      }
    },
    phone: {
      type: String,
      required: [true, "phone number is required"],
    },
    donated:[donorSchema],
    
    Requested:[patientSchema],

    role: {
      type: String,
      required: [true, "role is required"],
      enum: ["admin", "donor","patient"],
    },
    
    
  },

  // Set the select option to false for _id to exclude it from results
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);