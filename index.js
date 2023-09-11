const express = require("express");
require("dotenv").config();
const app = express();
const { router } = require("./routes/Auth.js");
const { QuizRouter } = require("./routes/Quiz.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());

// mongoose.connect(process.env.MONGO_URL).then(() => {
//   console.log("Db connection established");
// });


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Db connection established");
}

app.use("/" , (req ,res)=>{
  res.json("Welcome to Quiz web API service");
})
app.use("/", router);
app.use("/", QuizRouter);


app.listen(process.env.PORT, () => {
  console.log("listening on port ", process.env.PORT);
});
