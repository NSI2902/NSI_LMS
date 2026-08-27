const {
  createCourseBatch,
  getCourseBatches,
  getCourseBatchById,
  updateCourseBatch,
  updateCourseBatchStatus,
} = require("../services/courseBatch.service");

const create = async (req, res) => {
  try {
    const batch = await createCourseBatch(
      req.params.courseId,
      req.body,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      message: "Course batch created successfully",
      data: batch,
    });
  } catch (error) {
    const statusCode =
      error.message === "Course not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const { status, search } = req.query;

    const batches = await getCourseBatches(
      req.params.courseId,
      {
        status,
        search,
      }
    );

    return res.status(200).json({
      success: true,
      count: batches.length,
      data: batches,
    });
  } catch (error) {
    const statusCode =
      error.message === "Course not found" ? 404 : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const getOne = async (req, res) => {
  try {
    const batch = await getCourseBatchById(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      data: batch,
    });
  } catch (error) {
    const statusCode =
      error.message === "Batch not found" ? 404 : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const batch = await updateCourseBatch(
      req.params.id,
      req.body,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Course batch updated successfully",
      data: batch,
    });
  } catch (error) {
    const statusCode =
      error.message === "Batch not found" ? 404 : 400;

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

    const batch = await updateCourseBatchStatus(
      req.params.id,
      status,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: `Batch status updated to ${status}`,
      data: batch,
    });
  } catch (error) {
    const statusCode =
      error.message === "Batch not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  updateStatus,
};