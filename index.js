require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const errorMiddleware = require('./middlewares/error.middleware')

const router = require('./routes')

const app = express();
app.set("trust proxy", 1);
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}))
app.use(morgan(':method :url :status - :response-time ms'))
app.use(express.json())
app.use(cookieParser())

app.use('/api', router)

app.use(errorMiddleware)

const start = async () => {
  try {
    const PORT = process.env.PORT || 5000;

    await mongoose.connect(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is up and running on port ${PORT}`)
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

start()