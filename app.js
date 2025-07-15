const path = require("path");
const express = require("express");
const morgan = require("morgan");
// const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");
// const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const bodyParser = require("body-parser");

const AppError = require("./src/utils/appError");
const indexRouter = require("./src/routes/indexRoutes");
const expressListEndpoints = require("express-list-endpoints");

// Start Express App
const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Increase the limit to 50MB or more, depending on your needs
app.use(express.json({ limit: "100mb" })); // For JSON bodies
app.use(express.urlencoded({ limit: "100mb", extended: true })); // For URL encoded bodies

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// USING CORS
app.use(
  cors(
    {
      origin: "http://localhost:5000", // SHELL FRONTEND
      credentials: true, // REQUIRED to allow cookies
    },
    {
      origin: "http://localhost:5001", // VIDEO FRONTEND
      credentials: true, // REQUIRED to allow cookies
    },
    {
      origin: "http://localhost:5002", // CHANNEL FRONTEND
      credentials: true, // REQUIRED to allow cookies
    },
    {
      origin: "http://localhost:5008", // SETTINGS FRONTEND
      credentials: true, // REQUIRED to allow cookies
    },
  ),
);

// SET SECURITY HTTP HEADERS
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginOpenerPolicy: false,
    originAgentCluster: false,
  }),
);

// Development Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

console.log("Environment:", process.env.NODE_ENV || "development");
console.log("Node Version:", process.version);

// app.use(express.json()); //{ limit: '10kb' }
// app.use(express.urlencoded({ extended: true })); // limit: '10kb'
app.use(cookieParser());

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());
app.use(compression());

// Test Middlewares
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const attachUserToLocals = (req, res, next) => {
  if (req.user) res.locals.user = req.user;
  next();
};

// Apply the middleware to all routes
app.use(attachUserToLocals);

// 3) ROUTE
app.use("/api/v1/videos", indexRouter);

// eslint-disable-next-line arrow-body-style
app.get("*", (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404),
  );
});

const routes = expressListEndpoints(app);
console.log(`LISTING LENGTH OF ROUTES: `, routes.length);

module.exports = app;
