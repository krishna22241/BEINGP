const express = require('express');
const app = express();
const path = require("path");
const ejs = require('ejs');
require("dotenv").config();
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/database");

const {getDonorDetailsController ,getPatientDetailsController,getAllDonorRequests,getAllPatientRequests,getDonorDetailsCountController} = require('./controllers/Admin.js');
const userModel = require("./models/userModel");
const PORT = process.env.PORT || 4000;

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const authRoute = require("./routes/authRoutes");
const donorRoute = require("./routes/donorRoutes");
const requestRoute = require("./routes/requestRoutes");
const adminRoute = require("./routes/adminRoutes");
const methods=require("./controllers/authController");


app.use(methods.userCreator);

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/reg', (req, res) => {
    res.render('login_register'); // Render the register.ejs template
});

app.get('/regP', (req, res) => {
    res.render('registerP'); // Render the register.ejs template
});

app.get('/regA', (req, res) => {
    res.render('adminR'); // Render the register.ejs template
});

app.get('/logA', (req, res) => {
    res.render('loginA'); // Render the login.ejs template
});

app.get('/log', (req, res) => {
    res.render('login'); // Render the login.ejs template
});

app.get('/logP', (req, res) => {
    res.render('loginP'); // Render the login.ejs template
});


app.get('/donateblood',(req,res)=>{
    res.render('donateblood');
});


app.get('/requestblood',(req,res)=>{
    res.render('requestBlood');
});

app.get('/donorHistory',(req,res)=>{
    const user=res.locals.user[0].donated;
    res.render('donorHist',{data:user}  );
});


app.get('/phome',(req,res)=>{
    const user=res.locals.user[0].Requested;
    const totalCount = user.length;
    const pendingCount = user.filter(request => request.status === 'pending').length;
    const approvedCount = user.filter(request => request.status === 'approved').length;
    const rejectedCount = user.filter(request => request.status === 'rejected').length;
    res.render('patientHome',{totalCount , pendingCount , approvedCount, rejectedCount} );
   
});

app.get('/dhome',(req,res)=>{

    const user=res.locals.user[0].donated;
    const totalCount = user.length;
    const pendingCount = user.filter(request => request.status === 'pending').length;
    const approvedCount = user.filter(request => request.status === 'approved').length;
    const rejectedCount = user.filter(request => request.status === 'rejected').length;
    res.render('donorHome',{totalCount , pendingCount , approvedCount, rejectedCount} );
});


app.get('/patientHistory',(req,res)=>{
    const user=res.locals.user[0].Requested;
    res.render('patientHist',{data:user});
});

app.get('/Ahome',getDonorDetailsCountController);

app.get('/adminD' , getDonorDetailsController);

app.get('/adminP',getPatientDetailsController);

app.get('/adminDR',getAllDonorRequests);

app.get('/adminPR',getAllPatientRequests);

 

app.use("/api/v1",authRoute);
app.use("/api/v1", donorRoute);
app.use("/api/v1",requestRoute );
app.use("/api/v1",adminRoute);



dbConnect();

app.listen(PORT , ()=>{
    console.log(`server started successfully at ${PORT}`);
});

