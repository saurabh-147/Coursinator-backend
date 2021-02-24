const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const authRoutes = require("./src/routes/user");

const app = express();

//middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

const PORT = process.env.port || 8000;

app.listen(PORT, (req, res) => {
  console.log("Server started at port 8000");
});
