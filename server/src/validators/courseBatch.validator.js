const validateCreateCourseBatch = (req, res, next) => {
  const {
    batch_code,
    name,
    start_date,
    end_date,
  } = req.body;

  if (!batch_code || !batch_code.trim()) {
    return res.status(400).json({
      success: false,
      message: "Batch code is required",
    });
  }

  if (batch_code.trim().length > 50) {
    return res.status(400).json({
      success: false,
      message: "Batch code must not exceed 50 characters",
    });
  }

  if (!name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Batch name is required",
    });
  }

  if (name.trim().length > 150) {
    return res.status(400).json({
      success: false,
      message: "Batch name must not exceed 150 characters",
    });
  }

  if (start_date && end_date) {
    const start = new Date(start_date);
    const end = new Date(end_date);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date or end date",
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }
  }

  next();
};

const validateUpdateCourseBatch = (req, res, next) => {
  const {
    batch_code,
    name,
    start_date,
    end_date,
  } = req.body;

  if (batch_code !== undefined) {
    if (!batch_code || !batch_code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Batch code cannot be empty",
      });
    }

    if (batch_code.trim().length > 50) {
      return res.status(400).json({
        success: false,
        message: "Batch code must not exceed 50 characters",
      });
    }
  }

  if (name !== undefined) {
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Batch name cannot be empty",
      });
    }

    if (name.trim().length > 150) {
      return res.status(400).json({
        success: false,
        message: "Batch name must not exceed 150 characters",
      });
    }
  }

  if (start_date && end_date) {
    const start = new Date(start_date);
    const end = new Date(end_date);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date or end date",
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }
  }

  next();
};

module.exports = {
  validateCreateCourseBatch,
  validateUpdateCourseBatch,
};