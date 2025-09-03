const express = require("express");
const cors = require("cors");
const journalRoutes = require("./routes/journalRoutes");

const app = express();
require("dotenv").config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connected MongoDB"));
app.use(cors({ origin: "http://localhost:5173" }));

// ✅ Parse JSON body
app.use(express.json());

// ✅ Routes
app.use("/api/journals", journalRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
