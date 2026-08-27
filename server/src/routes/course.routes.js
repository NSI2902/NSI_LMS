const express = require("express");

const authenticate = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const {
  validateCreateCourse,
  validateUpdateCourse,
} = require("../validators/course.validator");

const {
  create,
  getAll,
  getOne,
  update,
  updateStatus,
} = require("../controllers/course.controller");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  getAll
);

router.get(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  getOne
);

router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  validateCreateCourse,
  create
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  validateUpdateCourse,
  update
);

router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("ADMIN"),
  updateStatus
);

module.exports = router;