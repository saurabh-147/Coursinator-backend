const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const userRoutes = require("./src/routes/user");
const courseRoutes = require("./src/routes/course");
const { main } = require("./src/routes/routes.json");

const app = express();

//middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

//routes
app.use(main.user, userRoutes);
app.use(main.course, courseRoutes);

const PORT = process.env.port || 8000;

app.listen(PORT, () => {
  console.log("Server started at port ", PORT);
});
