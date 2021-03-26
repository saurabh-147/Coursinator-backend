const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multer = require('multer');

const userRoutes = require("./src/routes/user");
const courseRoutes = require("./src/routes/course");
const { main } = require("./src/routes/routes.json");

const app = express();
const storage = multer.memoryStorage()
const upload = multer({storage:storage});

//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })) 
app.use(upload.single('image'))
app.use(cors());
app.use(cookieParser());

//routes
app.use(main.user, userRoutes);
app.use(main.course, courseRoutes);

const PORT = process.env.port || 8000;

app.listen(PORT, () => {
  console.log("Server started at port ", PORT);
});
