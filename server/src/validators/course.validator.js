const validateCreateCourse = (req, res, next) => {
  const {
    course_code,
    name,
    category_id,
    duration_value,
    duration_unit,
  } = req.body;

  if (!course_code || !course_code.trim()) {
    return res.status(400).json({
      success: false,
      message: "Course code is required",
    });
  }

  if (course_code.trim().length > 50) {
    return res.status(400).json({
      success: false,
      message: "Course code must not exceed 50 characters",
    });
  }

  if (!name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Course name is required",
    });
  }

  if (name.trim().length > 200) {
    return res.status(400).json({
      success: false,
      message: "Course name must not exceed 200 characters",
    });
  }

  if (category_id !== undefined && category_id !== null) {
    if (!Number.isInteger(Number(category_id)) || Number(category_id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }
  }

  if (duration_value !== undefined && duration_value !== null) {
    if (
      !Number.isInteger(Number(duration_value)) ||
      Number(duration_value) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Duration value must be a positive integer",
      });
    }
  }

  if (duration_unit !== undefined && duration_unit !== null) {
    const allowedUnits = ["DAYS", "WEEKS", "MONTHS"];

    if (!allowedUnits.includes(duration_unit)) {
      return res.status(400).json({
        success: false,
        message: "Invalid duration unit",
      });
    }
  }

  next();
};

const validateUpdateCourse = (req, res, next) => {
  const {
    course_code,
    name,
    category_id,
    duration_value,
    duration_unit,
  } = req.body;

  if (course_code !== undefined) {
    if (!course_code || !course_code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Course code cannot be empty",
      });
    }

    if (course_code.trim().length > 50) {
      return res.status(400).json({
        success: false,
        message: "Course code must not exceed 50 characters",
      });
    }
  }

  if (name !== undefined) {
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Course name cannot be empty",
      });
    }

    if (name.trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: "Course name must not exceed 200 characters",
      });
    }
  }

  if (category_id !== undefined && category_id !== null) {
    if (!Number.isInteger(Number(category_id)) || Number(category_id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }
  }

  if (duration_value !== undefined && duration_value !== null) {
    if (
      !Number.isInteger(Number(duration_value)) ||
      Number(duration_value) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Duration value must be a positive integer",
      });
    }
  }

  if (duration_unit !== undefined && duration_unit !== null) {
    const allowedUnits = ["DAYS", "WEEKS", "MONTHS"];

    if (!allowedUnits.includes(duration_unit)) {
      return res.status(400).json({
        success: false,
        message: "Invalid duration unit",
      });
    }
  }

  next();
};

module.exports = {
  validateCreateCourse,
  validateUpdateCourse,
};