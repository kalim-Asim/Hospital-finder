const express = require("express");
const app = express();
const Doctor = require("../model/doctorModel");
const Activity = require("../model/activityModel"); 
const {
  EditProfile,
  Signup,
  Login,
  ForgotPassword,
  ResetPassword,
  Bookappointment,
  AddDoctor } = require("../controller/userController")
const route = express.Router();
const path = require("path");
const User = require("../model/userModel");
const templatePath = path.join(__dirname, '../../templates')
app.use(express.static(path.join(__dirname, '../../src')));

app.use(express.json())
app.set("view engine", "hbs")
app.set("views", templatePath)
app.use(express.static('public'));
app.use('/img', express.static('public/img'));    // Assuming 'img' folder is inside 'public'
app.use(express.urlencoded({ extended: false }))

route.get("/", (req, res) => res.render("homepage"))
route.get("/login", (req, res) => res.render("login"))
route.get("/signup", (req, res) => res.render("signup"))
route.get("/add-doctor", (req, res) => res.render("add-doctor"))
route.get("/user-profile", (req, res) => res.render("user-profile"))
route.get("/forgot-password", (req, res) => {
  res.render("forgot-password");
})
route.get('/Admin-Dashboard', async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const recentActivities = await Activity.find().sort({ timestamp: -1 }).limit(10);

    // Format timestamps
    const formattedActivities = recentActivities.map(activity => ({
      description: activity.description,
      timestamp: activity.timestamp.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    }));

    res.render('Admin-Dashboard', { totalDoctors, recentActivities: formattedActivities });
  } catch (error) {
    console.error("Error loading admin dashboard: ", error);
    res.status(500).send("Error loading admin dashboard");
  }
});

// route.get('/Admin-Dashboard', async (req, res) => {
//   try {
//     const totalDoctors = await Doctor.countDocuments();
//     const recentActivities = await Activity.find().sort({ timestamp: -1 }).limit(10);

//     res.render('Admin-Dashboard', { totalDoctors, recentActivities });
//   } catch (error) {
//     console.error("Error loading admin dashboard: ", error);
//     res.status(500).send("Error loading admin dashboard");
//   }
// });

route.get("/reset-password/:token", (req, res) => {
  res.render("reset-password", { token: req.params.token });
});
route.get("/edit-profile", async (req, res) => {
  res.render("edit-profile");
});
route.get("/add-doctor", async (req, res) => {
  res.render("add-doctor");
});
route.get("/book-appointment", (req, res) => {
  res.render("book-appointment");  // Render your appointment booking page
});


route.post("/signup", Signup);
route.post("/login", Login);

route.post("/forgot-password", ForgotPassword);
route.post("/reset-password/:token", ResetPassword);
route.post("/edit-profile", EditProfile);
route.post("/add-doctor", AddDoctor);
route.post("/book-appointment", Bookappointment);

module.exports = route;