const {
  assignInstructor,
  getInstructorAssignments,
  updateInstructorAssignmentStatus,
  removeInstructor,
} = require("../services/courseInstructor.service");

const assign = async (req, res) => {
  try {
    const assignment = await assignInstructor(
      req.params.batchId,
      req.body.instructor_id,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      message:
        "Instructor assigned to batch successfully",
      data: assignment,
    });
  } catch (error) {
    const notFoundMessages = [
      "Batch not found",
      "Instructor user not found",
    ];

    const statusCode = notFoundMessages.includes(
      error.message
    )
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
    const assignments =
      await getInstructorAssignments(
        req.params.batchId
      );

    return res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
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

    const assignment =
      await updateInstructorAssignmentStatus(
        req.params.batchId,
        req.params.instructorId,
        status,
        req.user.id
      );

    return res.status(200).json({
      success: true,
      message:
        "Instructor assignment status updated successfully",
      data: assignment,
    });
  } catch (error) {
    const statusCode =
      error.message ===
      "Instructor assignment not found"
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
    await removeInstructor(
      req.params.batchId,
      req.params.instructorId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Instructor removed from batch successfully",
    });
  } catch (error) {
    const statusCode =
      error.message ===
      "Instructor assignment not found"
        ? 404
        : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  assign,
  getAll,
  updateStatus,
  remove,
};