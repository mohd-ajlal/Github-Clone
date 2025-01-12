const mongoose = require("mongoose");

const DB = process.env.DB_URI;

mongoose.connect(DB)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));
