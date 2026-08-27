const express = require("express");

const authenticate = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const {
  validateCreateCourseCategory,
  validateUpdateCourseCategory,
} = require("../validators/courseCategory.validator");

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  updateCategoryStatus,
} = require("../controllers/courseCategory.controller");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  getCategories
);

router.get(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  getCategory
);

router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  validateCreateCourseCategory,
  createCategory
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  validateUpdateCourseCategory,
  updateCategory
);

router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("ADMIN"),
  updateCategoryStatus
);

module.exports = router;