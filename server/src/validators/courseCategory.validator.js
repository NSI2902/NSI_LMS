const validateCreateCourseCategory = (req, res, next) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Category name is required",
    });
  }

  if (name.trim().length > 150) {
    return res.status(400).json({
      success: false,
      message: "Category name must not exceed 150 characters",
    });
  }

  next();
};

const validateUpdateCourseCategory = (req, res, next) => {
  const { name } = req.body;

  if (name !== undefined) {
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name cannot be empty",
      });
    }

    if (name.trim().length > 150) {
      return res.status(400).json({
        success: false,
        message: "Category name must not exceed 150 characters",
      });
    }
  }

  next();
};

module.exports = {
  validateCreateCourseCategory,
  validateUpdateCourseCategory,
};