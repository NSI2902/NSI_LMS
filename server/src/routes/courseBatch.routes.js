const express = require("express");

const authenticate = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const {
  validateCreateCourseBatch,
  validateUpdateCourseBatch,
} = require("../validators/courseBatch.validator");

const {
  create,
  getAll,
  getOne,
  update,
  updateStatus,
} = require("../controllers/courseBatch.controller");

const router = express.Router();

router.post(
  "/courses/:courseId/batches",
  authenticate,
  authorizeRoles("ADMIN"),
  validateCreateCourseBatch,
  create
);

router.get(
  "/courses/:courseId/batches",
  authenticate,
  authorizeRoles("ADMIN"),
  getAll
);

router.get(
  "/batches/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  getOne
);

router.put(
  "/batches/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  validateUpdateCourseBatch,
  update
);

router.patch(
  "/batches/:id/status",
  authenticate,
  authorizeRoles("ADMIN"),
  updateStatus
);

module.exports = router;