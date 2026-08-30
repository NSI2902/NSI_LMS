const express = require("express");

const router = express.Router();

const lectureController = require("../controllers/lecture.controller");

const {
  validateCreateLecture,
  validateUpdateLecture,
  validateLectureId,
  validateModuleId,
  validateLectureStatus,
  validateLectureOrder,
} = require("../validators/lecture.validator");

/*
 * Create lecture
 */
router.post(
  "/modules/:moduleId/lectures",
  validateModuleId,
  validateCreateLecture,
  lectureController.createLecture
);

/*
 * Get all lectures of a module
 */
router.get(
  "/modules/:moduleId/lectures",
  validateModuleId,
  lectureController.getLecturesByModule
);

/*
 * Get single lecture
 */
router.get(
  "/lectures/:lectureId",
  validateLectureId,
  lectureController.getLectureById
);

/*
 * Update lecture
 */
router.put(
  "/lectures/:lectureId",
  validateLectureId,
  validateUpdateLecture,
  lectureController.updateLecture
);

/*
 * Update lecture status
 */
router.patch(
  "/lectures/:lectureId/status",
  validateLectureId,
  validateLectureStatus,
  lectureController.updateLectureStatus
);

/*
 * Update lecture order
 */
router.patch(
  "/lectures/:lectureId/order",
  validateLectureId,
  validateLectureOrder,
  lectureController.updateLectureOrder
);

/*
 * Archive lecture
 */
router.delete(
  "/lectures/:lectureId",
  validateLectureId,
  lectureController.deleteLecture
);

module.exports = router;