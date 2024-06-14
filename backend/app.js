const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config({ path: './config/.env.run' });
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.static("public"));
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(cors());

const translation_router = require("./routes/translation_router");
app.use("/api/translate", translation_router);
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});