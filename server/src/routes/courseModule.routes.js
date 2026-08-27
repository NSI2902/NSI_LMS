const express = require("express");

const router = express.Router();

const courseModuleController = require("../controllers/courseModule.controller");

const {
  createModuleValidator,
  updateModuleValidator,
  moduleIdValidator,
  courseIdValidator,
  updateModuleStatusValidator,
  updateModuleOrderValidator,
} = require("../validators/courseModule.validator");

// Create module
router.post(
  "/courses/:courseId/modules",
  createModuleValidator,
  courseModuleController.createModule
);

// Get all modules of a course
router.get(
  "/courses/:courseId/modules",
  courseIdValidator,
  courseModuleController.getModulesByCourse
);

// Get single module
router.get(
  "/modules/:moduleId",
  moduleIdValidator,
  courseModuleController.getModuleById
);

// Update module
router.put(
  "/modules/:moduleId",
  updateModuleValidator,
  courseModuleController.updateModule
);

// Update module status
router.patch(
  "/modules/:moduleId/status",
  updateModuleStatusValidator,
  courseModuleController.updateModuleStatus
);

// Change module order
router.patch(
  "/modules/:moduleId/order",
  updateModuleOrderValidator,
  courseModuleController.updateModuleOrder
);

// Archive module
router.delete(
  "/modules/:moduleId",
  moduleIdValidator,
  courseModuleController.deleteModule
);

module.exports = router;