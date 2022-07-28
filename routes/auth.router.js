const { Router } = require("express");
const router = Router();
const { body, check, withMessage } = require("express-validator");

const authMiddleware = require('../middlewares/auth.middleware')
const AuthController = require("../controllers/Auth.controller");

router.post(
  "/registration",
  body("email", "Invalid email").isEmail(),
  check("password")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Password is empty")
    .isLength({ min: 6, max: 54 })
    .withMessage("Password should have from 6 to 54 chars"),
  AuthController.registration
);
router.post(
  "/login",
  body("email", "Invalid email").isEmail(),
  check("password")
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage("Password is empty"),
  AuthController.login
);
router.post("/logout", AuthController.logout);
router.get("/refresh", AuthController.refresh);

module.exports = router;
