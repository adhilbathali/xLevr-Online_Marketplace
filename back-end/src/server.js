// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const mainRouter = require('./routes/index'); // Requires the exported router from index.js

connectDB();

const cron = require("node-cron");
const processHybridQueue = require("./services/cron/hybridQueManagement");

cron.schedule("0 * * * *", async () => {
  console.log("⏰ Cron job triggered!");
  await processHybridQueue();
  console.log("✅ Batch rotation check completed.");
});



const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount the entire router at the root path '/'
app.use('/', mainRouter); // This should now receive a valid router function

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});