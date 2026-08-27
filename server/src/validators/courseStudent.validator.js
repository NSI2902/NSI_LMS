const validateEnrollStudent = (req, res, next) => {
  const { student_id } = req.body;

  if (!student_id) {
    return res.status(400).json({
      success: false,
      message: "Student ID is required",
    });
  }

  if (
    !Number.isInteger(Number(student_id)) ||
    Number(student_id) <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid student ID",
    });
  }

  next();
};

module.exports = {
  validateEnrollStudent,
};