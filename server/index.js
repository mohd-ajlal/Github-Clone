require("dotenv").config();

const express = require("express");
const app = express();
const authRoutes = require("./routes/auth.route.js");

const dotenv = require('dotenv');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require("./db/conn");

const passport = require('passport');
require('./passport/github.auth');

const port = 5000;

dotenv.config();

app.use(session({ secret: "keyboard cat", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use("/api/auth", authRoutes);

app.listen(port, () => {
    console.log(`Server start at port no : ${port}`);
});