require("dotenv").config();
const express = require("express");
const app = express();
// const cors = require("cors");
// const cookiParser = require("cookie-parser")
require("./db/conn");


const port = 5000;


app.use(express.json());
// app.use(cookiParser());
// app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World');
    }
);

app.listen(port,()=>{
    console.log(`Server start at port no : ${port}`);
})