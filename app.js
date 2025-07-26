const express = require("express");
const cookieParser = require("cookie-parser");
// const Routes = require("./src/Middlewares/routes-config");
const clear = require("clear");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
// const corsOptions = require("./src/Middlewares/Cors-configurations/cors-options");
// const credentials = require("./src/Middlewares//Cors-configurations/credentials");
const port = process.env.PORT || 5015;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use(credentials);
// app.use(cors(corsOptions))

// Routes(app);

app.use((req, res) => {
  res.status(404).send("Route not found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// FOR DEPLOYMENT
// const options = {
//     key: fs.readFileSync(
//       "/etc/letsencrypt/live/ilearn-beta.depedimuscity.com/privkey.pem"
//     ),
//     cert: fs.readFileSync(
//       "/etc/letsencrypt/live/ilearn-beta.depedimuscity.com/fullchain.pem"
//     ),
//   };

// const server = https.createServer(options, app);

// server.listen(port, () => {
//     clear(); // Clear the terminal when the server starts
//     console.log(`Server running on port ${port}`);
//     console.log(`Environment: ${process.env.NODE_ENV}`);
//   });

app.listen(port, () => {
  clear(); // Clear the terminal when the server starts
  console.log(`Server running on port ${port}`);
});
