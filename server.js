const express = require("express");
const app = express();

const connectDB = require("./config/db");

//Connect Database
connectDB();

app.get("/", (req, res) => res.send("API Running"));

//Init Middleware
app.use(express.json({ extended: false }));

//Define Routes
app.use("/api/user", require("./routes/api/user"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/register", require("./routes/api/register"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
