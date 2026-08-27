const express = require("express");

const authenticate = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const {
  validateEnrollStudent,
} = require("../validators/courseStudent.validator");

const {
  enroll,
  getAll,
  updateStatus,
  remove,
} = require("../controllers/courseStudent.controller");

const router = express.Router();

router.post(
  "/batches/:batchId/students",
  authenticate,
  authorizeRoles("ADMIN"),
  validateEnrollStudent,
  enroll
);

router.get(
  "/batches/:batchId/students",
  authenticate,
  authorizeRoles("ADMIN"),
  getAll
);

router.patch(
  "/batches/:batchId/students/:studentId/status",
  authenticate,
  authorizeRoles("ADMIN"),
  updateStatus
);

router.delete(
  "/batches/:batchId/students/:studentId",
  authenticate,
  authorizeRoles("ADMIN"),
  remove
);

module.exports = router;