const validateAssignInstructor = (req, res, next) => {
  const { instructor_id } = req.body;

  if (!instructor_id) {
    return res.status(400).json({
      success: false,
      message: "Instructor ID is required",
    });
  }

  if (
    !Number.isInteger(Number(instructor_id)) ||
    Number(instructor_id) <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid instructor ID",
    });
  }

  next();
};

module.exports = {
  validateAssignInstructor,
};