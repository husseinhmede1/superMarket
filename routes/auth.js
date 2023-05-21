const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

let User = require("../models/user.model");

//register User
router.route("/register").post(async (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  const phone = req.body.phone;
  const address1 = req.body.address1;
  const address2 = req.body.address2;
  const rol = 'user';

  //check if email exist
  let user = await User.findOne({ phone: phone });
  if (user) {
    return res.status(400).send("user already registered");
  }

  bcrypt.hash(password, 10, function (err, hashedPass) {
    if (err) {
      res.json({
        error: err,
      });
    }
    if (hashedPass) {
      //else add new user
      const newUser = new User({
        name,
        password: hashedPass,
        phone,
        address1,
        address2,
        rol
      });

      newUser
        .save()
        .then(() => {
          const token = jwt.sign(
            { id: newUser.id, name: newUser.name, phone: newUser.phone, rol: rol },
            "verySecretValue",
            { expiresIn: "24h" }
          );
          const response = {
            token: token,
            user: newUser,
          };

          res.send(response);
        })
        .catch((err) => res.status(400).send(err));
    }
  });
});




//login User
router.route("/login").post(async (req, res) => {
  const phone = req.body.phone;
  const password = req.body.password;

  User.findOne({ phone: phone })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, function (err, hashedPass) {
          if (err) {
            res.json({
              error: err,
            });
          }
          if (hashedPass) {
            let token = null;
            if (user.rol) {
              token = jwt.sign(
                {
                  id: user.id,
                  name: user.name,
                  phone: user.phone,
                  rol: user.rol,
                },
                "verySecretValue",
                { expiresIn: "24h" }
              );
            }

            const response = {
              token: token,
              user: user,
            };
            res.send(response);
          } else {
            res.status(401).send("Bad login");
          }
        });
      } else {
        res.status(401).send("Bad login");
      }
    });
});

module.exports = router;
