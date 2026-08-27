const {
  enrollStudent,
  getStudentsByBatch,
  updateEnrollmentStatus,
  removeStudent,
} = require("../services/courseStudent.service");

const enroll = async (req, res) => {
  try {
    const enrollment = await enrollStudent(
      req.params.batchId,
      req.body.student_id,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      message:
        "Student enrolled in batch successfully",
      data: enrollment,
    });
  } catch (error) {
    const notFoundMessages = [
      "Batch not found",
      "Student user not found",
    ];

    const statusCode =
      notFoundMessages.includes(error.message)
        ? 404
        : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const students =
      await getStudentsByBatch(
        req.params.batchId
      );

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    const statusCode =
      error.message === "Batch not found"
        ? 404
        : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const enrollment =
      await updateEnrollmentStatus(
        req.params.batchId,
        req.params.studentId,
        status,
        req.user.id
      );

    return res.status(200).json({
      success: true,
      message:
        "Student enrollment status updated successfully",
      data: enrollment,
    });
  } catch (error) {
    const statusCode =
      error.message ===
      "Student enrollment not found"
        ? 404
        : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    await removeStudent(
      req.params.batchId,
      req.params.studentId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Student removed from batch successfully",
    });
  } catch (error) {
    const statusCode =
      error.message ===
      "Student enrollment not found"
        ? 404
        : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  enroll,
  getAll,
  updateStatus,
  remove,
};