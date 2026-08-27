const express = require("express");

const authenticate = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const {
  validateAssignInstructor,
} = require("../validators/courseInstructor.validator");

const {
  assign,
  getAll,
  updateStatus,
  remove,
} = require("../controllers/courseInstructor.controller");

const router = express.Router();

router.post(
  "/batches/:batchId/instructors",
  authenticate,
  authorizeRoles("ADMIN"),
  validateAssignInstructor,
  assign
);

router.get(
  "/batches/:batchId/instructors",
  authenticate,
  authorizeRoles("ADMIN"),
  getAll
);

router.patch(
  "/batches/:batchId/instructors/:instructorId/status",
  authenticate,
  authorizeRoles("ADMIN"),
  updateStatus
);

router.delete(
  "/batches/:batchId/instructors/:instructorId",
  authenticate,
  authorizeRoles("ADMIN"),
  remove
);

module.exports = router;