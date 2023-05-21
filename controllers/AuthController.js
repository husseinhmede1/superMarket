var jwt = require("jsonwebtoken");
const { type } = require("os");

exports.verifyToken = function (req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, "verySecretValue");
    if (decoded.rol === "user") {
      req.decoded = decoded;
    } else {
      return res.status(403).send("Invalid Token");
    }
    next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return true;
};

exports.verifyAdminToken = function (req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, "verySecretValue");
    if (decoded.rol === "admin") {
      req.decoded = decoded;
    } else {
      return res.status(403).send("Invalid Token");
    }
    next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return true;
};


exports.staticTypes = function (req, res, next) {
  const types = [
    {
      "typeName": "water",
      "image": "https://drive.google.com/file/d/1rFedrHW9FBQTdxPHJTbiu0zUyvZbFQKN/preview"
    },
    {
      "typeName": "soda",
      "image": "https://drive.google.com/file/d/1uXw7ZsSY_Xi_sPGbQ-XZOm_KS5BuUgVV/preview"
    },
    {
      "typeName": "cigarettes",
      "image": "https://drive.google.com/file/d/17G68AxgKqaDwgs6Mjb0fTljUoe-wgVYN/preview"
    },
    {
      "typeName": "bread",
      "image": "https://drive.google.com/file/d/1IZLSUkXdji-GAeNsG5ofFtw5S2v9HD-X/preview"
    },
    {
      "typeName": "alcohol",
      "image": "https://drive.google.com/file/d/1CGnytzh3yJwb0wlt9T8pT3bHyyzP7MiD/preview"
    },
    {
      "typeName": "dessert",
      "image": "https://drive.google.com/file/d/1bcpIs3GeYJw3JQi9cfKCnC1a7uPSMvTD/preview"
    },
  ];

  req.types = types;
  next();

  return true;
};
