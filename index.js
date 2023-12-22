if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratagy = require("passport-local");
const User = require("./models/user.js");


app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));


// "mongodb://127.0.0.1:27017/wanderlust"
const dbUrl = process.env.atlasDb_Url;


const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.secret,
  },
  touchAfter:24 * 3600,

});

store.on("error",()=>{
  console.log("error in mongo store");
})

app.use(
  session({
    store,
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() * 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);




app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratagy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


async function main() {
  await mongoose.connect(dbUrl);
}

main().then(() => {
  console.log("wanderlust database connection is successfull");
});



app.use((req, res, next) => {
  res.locals.sucess = req.flash("sucess");
  res.locals.error = req.flash("error");
  res.locals.isLogged = req.user;
  next();
});

app.use("/listing", listingRouter);

app.use("/listings/:id/reviews", reviewRouter);

app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new expressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something error has been occured" } = err;
  res.status(statusCode).render("error.ejs", { err });
});


app.listen(port, () => {
    console.log(`server is started with port number ${port}`);
  });