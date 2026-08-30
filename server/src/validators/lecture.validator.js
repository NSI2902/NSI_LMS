const validateCreateLecture = (req, res, next) => {
  const {
    title,
    lecture_type,
    status,
    display_order,
    scheduled_at,
    duration_minutes,
    meet_url,
    recording_url,
    recording_provider,
    recording_status,
  } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "Lecture title is required",
    });
  }

  if (!lecture_type) {
    return res.status(400).json({
      success: false,
      message: "Lecture type is required",
    });
  }

  if (!["RECORDED", "LIVE"].includes(lecture_type)) {
    return res.status(400).json({
      success: false,
      message: "Invalid lecture type",
    });
  }

  if (
    status !== undefined &&
    ![
      "DRAFT",
      "SCHEDULED",
      "LIVE",
      "COMPLETED",
      "RECORDING_AVAILABLE",
      "CANCELLED",
      "PUBLISHED",
    ].includes(status)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid lecture status",
    });
  }

  if (
    display_order !== undefined &&
    (!Number.isInteger(Number(display_order)) ||
      Number(display_order) < 0)
  ) {
    return res.status(400).json({
      success: false,
      message: "display_order must be a non-negative integer",
    });
  }

  if (
    duration_minutes !== undefined &&
    duration_minutes !== null &&
    (!Number.isInteger(Number(duration_minutes)) ||
      Number(duration_minutes) <= 0)
  ) {
    return res.status(400).json({
      success: false,
      message: "duration_minutes must be a positive integer",
    });
  }

  if (
    recording_provider !== undefined &&
    recording_provider !== null &&
    !["GOOGLE_DRIVE", "S3"].includes(recording_provider)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid recording provider",
    });
  }

  if (
    recording_status !== undefined &&
    !["NOT_AVAILABLE", "AVAILABLE"].includes(recording_status)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid recording status",
    });
  }

  if (lecture_type === "LIVE" && !meet_url) {
    return res.status(400).json({
      success: false,
      message: "meet_url is required for LIVE lectures",
    });
  }

  if (lecture_type === "RECORDED" && recording_url) {
    // Valid recorded lecture configuration
  }

  req.body.title = title.trim();

  next();
};

const validateUpdateLecture = (req, res, next) => {
  const {
    title,
    lecture_type,
    status,
    display_order,
    duration_minutes,
    recording_provider,
    recording_status,
  } = req.body;

  if (
    title !== undefined &&
    (!title || !title.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "Lecture title cannot be empty",
    });
  }

  if (
    lecture_type !== undefined &&
    !["RECORDED", "LIVE"].includes(lecture_type)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid lecture type",
    });
  }

  if (
    status !== undefined &&
    ![
      "DRAFT",
      "SCHEDULED",
      "LIVE",
      "COMPLETED",
      "RECORDING_AVAILABLE",
      "CANCELLED",
      "PUBLISHED",
    ].includes(status)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid lecture status",
    });
  }

  if (
    display_order !== undefined &&
    (!Number.isInteger(Number(display_order)) ||
      Number(display_order) < 0)
  ) {
    return res.status(400).json({
      success: false,
      message: "display_order must be a non-negative integer",
    });
  }

  if (
    duration_minutes !== undefined &&
    duration_minutes !== null &&
    (!Number.isInteger(Number(duration_minutes)) ||
      Number(duration_minutes) <= 0)
  ) {
    return res.status(400).json({
      success: false,
      message: "duration_minutes must be a positive integer",
    });
  }

  if (
    recording_provider !== undefined &&
    recording_provider !== null &&
    !["GOOGLE_DRIVE", "S3"].includes(recording_provider)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid recording provider",
    });
  }

  if (
    recording_status !== undefined &&
    !["NOT_AVAILABLE", "AVAILABLE"].includes(recording_status)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid recording status",
    });
  }

  if (title !== undefined) {
    req.body.title = title.trim();
  }

  next();
};

const validateLectureId = (req, res, next) => {
  const { lectureId } = req.params;

  if (
    !lectureId ||
    !Number.isInteger(Number(lectureId)) ||
    Number(lectureId) <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid lecture ID",
    });
  }

  next();
};

const validateModuleId = (req, res, next) => {
  const { moduleId } = req.params;

  if (
    !moduleId ||
    !Number.isInteger(Number(moduleId)) ||
    Number(moduleId) <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid module ID",
    });
  }

  next();
};

const validateLectureStatus = (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: "Status is required",
    });
  }

  if (
    ![
      "DRAFT",
      "SCHEDULED",
      "LIVE",
      "COMPLETED",
      "RECORDING_AVAILABLE",
      "CANCELLED",
      "PUBLISHED",
    ].includes(status)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid lecture status",
    });
  }

  next();
};

const validateLectureOrder = (req, res, next) => {
  const { display_order } = req.body;

  if (
    display_order === undefined ||
    !Number.isInteger(Number(display_order)) ||
    Number(display_order) < 0
  ) {
    return res.status(400).json({
      success: false,
      message: "display_order must be a non-negative integer",
    });
  }

  next();
};

module.exports = {
  validateCreateLecture,
  validateUpdateLecture,
  validateLectureId,
  validateModuleId,
  validateLectureStatus,
  validateLectureOrder,
};