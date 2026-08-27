const { body, param } = require("express-validator");

const createModuleValidator = [
  param("courseId")
    .isInt({ min: 1 })
    .withMessage("Course ID must be a valid positive integer"),

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Module title is required")
    .isLength({ max: 200 })
    .withMessage("Module title cannot exceed 200 characters"),

  body("description")
    .optional({ nullable: true })
    .isString()
    .withMessage("Description must be a string"),

  body("display_order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer"),
];

const updateModuleValidator = [
  param("moduleId")
    .isInt({ min: 1 })
    .withMessage("Module ID must be a valid positive integer"),

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Module title cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Module title cannot exceed 200 characters"),

  body("description")
    .optional({ nullable: true })
    .isString()
    .withMessage("Description must be a string"),

  body("display_order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer"),
];

const moduleIdValidator = [
  param("moduleId")
    .isInt({ min: 1 })
    .withMessage("Module ID must be a valid positive integer"),
];

const courseIdValidator = [
  param("courseId")
    .isInt({ min: 1 })
    .withMessage("Course ID must be a valid positive integer"),
];

const updateModuleStatusValidator = [
  param("moduleId")
    .isInt({ min: 1 })
    .withMessage("Module ID must be a valid positive integer"),

  body("status")
    .isIn(["DRAFT", "PUBLISHED", "ARCHIVED"])
    .withMessage("Invalid module status"),
];

const updateModuleOrderValidator = [
  param("moduleId")
    .isInt({ min: 1 })
    .withMessage("Module ID must be a valid positive integer"),

  body("display_order")
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer"),
];

module.exports = {
  createModuleValidator,
  updateModuleValidator,
  moduleIdValidator,
  courseIdValidator,
  updateModuleStatusValidator,
  updateModuleOrderValidator,
};