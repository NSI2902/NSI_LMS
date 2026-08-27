const express = require("express");

const authenticate = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();

router.get(
  "/admin",
  authenticate,
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.json({
      success: true,
      message: "Admin route accessed successfully",
      user: req.user,
    });
  }
);

router.get(
  "/instructor",
  authenticate,
  authorizeRoles("INSTRUCTOR"),
  (req, res) => {
    res.json({
      success: true,
      message: "Instructor route accessed successfully",
      user: req.user,
    });
  }
);

router.get(
  "/student",
  authenticate,
  authorizeRoles("STUDENT"),
  (req, res) => {
    res.json({
      success: true,
      message: "Student route accessed successfully",
      user: req.user,
    });
  }
);

module.exports = router;