const express = require('express');
const http = require('http');
const bookman = require("bookman");
const handlebars = require("express-handlebars");
const url = require("url");
const Discord = require("discord.js");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const handlebarshelpers = require("handlebars-helpers")();
const path = require("path");
const passport = require("passport");
const { Strategy } = require("passport-discord");
const session = require("express-session");
const client = new Discord.Client();
const randomString = require("random-string");
const db = (global.db = {});

let ranks = ["normal", "altin", "elmas", "hazir", "topluluk", "api"];
for (let rank in ranks) {
  db[ranks[rank]] = new bookman(ranks[rank]);
}


const IDler = {
  botID: "782228590879965194",
  botToken: "NzgyMjI4NTkwODc5OTY1MTk0.X8JJJQ.6RjRNxbsqZka3kmGrGkd2NcxIgw",
  botSecret: "JzwlbLXJKZkHSyrUb2jR8b_JjBXFW9Qj",
  botCallbackURL: "https://youtuberss.glitch.me/callback",
  sunucuID: "781784852755644416",
  sunucuDavet: "https://discord.gg/UujjWMHsmM",
  mertkYoutube: "https://youtube.com/MertKaymaz35TR",
  erencYoutube: "https://youtube.com/ErenCaran",
  cekalYoutube: "https://www.youtube.com/channel/UCXFtwnJti8bBxExQp2LywGg",
  mertDiscord: "https://discord.gg/VJ5MpsCuJ5",
  czczDavet: "https://discord.com/oauth2/authorize?client_id=782228590879965194&permissions=8&redirect_uri=https%3A%2F%2Fyoutuberss.glitch.me%2Fcdiscord&response_type=code&scope=guilds%20bot",
  caranDiscord: "https://discord.gg/ZVr6ukkV7x",
  sahipRolü: "781784852785397772"
};

const app = express();


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: false
  })
);
app.use(cookieParser());
app.engine(
  "handlebars",
  handlebars({
    defaultLayout: "main",
    layoutsDir: `${__dirname}/views/layouts/`,
    helpers: handlebarshelpers
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});
const scopes = ["identify", "guilds"];
passport.use(
  new Strategy(
    {
      clientID: IDler.botID,
      clientSecret: IDler.botSecret,
      callbackURL: IDler.botCallbackURL,
      scope: scopes
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => done(null, profile));
    }
  )
);
app.use(
  session({
    secret: "secret-session-thing",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.get(
  "/giris",
  passport.authenticate("discord", {
    scope: scopes
  })
);
app.get(
  "/callback",
  passport.authenticate("discord", {
    failureRedirect: "/error"
  }),
  (req, res) => {
    res.redirect("/");
  }
);
app.get("/cdiscord", (req, res) => {
  res.redirect(IDler.sunucuDavet);
});
app.get("/myoutube", (req, res) => {
  res.redirect(IDler.mertkYoutube);
});
app.get("/eyoutube", (req, res) => {
  res.redirect(IDler.erencYoutube);
});
app.get("/mcyoutube", (req, res) => {
  res.redirect(IDler.cekalYoutube);
});
app.get("/mdiscord", (req, res) => {
  res.redirect(IDler.mertDiscord);
});
app.get("/cizcizpluss", (req, res) => {
  res.redirect(IDler.czczDavet);
});
app.get("/ecdiscord", (req, res) => {
  res.redirect(IDler.caranDiscord);
});

/* SAYFALAR BURADAN İTİBAREN */
app.get("/", (req, res) => {
  res.render("index", {
    user: req.user
  });
});



app.use((req, res) => {
  const err = new Error("Not Found");
  err.status = 404;
  return res.redirect(
    url.format({
      pathname: "/hata",
      query: {
        statuscode: 404,
        message: "Sayfa Bulunamadı"
      }
    })
  );
});

client.login(IDler.botToken);

client.on("ready", () => {
  const listener = app.listen(process.env.PORT, function() {
    console.log("Mangal Yandı Dayı Goş!");
  });
});

