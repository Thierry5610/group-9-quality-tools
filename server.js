const express = require("express");
const cors = require("cors");

const app = express();

const swaggerConfig = require("./app/config/swagger");

// Call the Swagger setup
swaggerConfig(app);

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(express.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// Base route
app.get("/", (req, res) => {
  res.json({ 
    message: "Welcome to bezkoder application.", 
    documentation: "http://localhost:8080/api-docs" 
  });
});

// Import routes
require("./app/routes/turorial.routes")(app);
require("./app/routes/auth.routes")(app);

// Set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
