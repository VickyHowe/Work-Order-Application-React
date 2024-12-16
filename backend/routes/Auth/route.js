const express = require("express");
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const { register, login, update, deleteUser } = require("./auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/update", authMiddleware).put(update);
router.route("/deleteUser", authMiddleware).delete(deleteUser);

module.exports = router