const {
  createCourseCategory,
  getCourseCategories,
  getCourseCategoryById,
  updateCourseCategory,
  updateCourseCategoryStatus,
} = require("../services/courseCategory.service");

const createCategory = async (req, res) => {
  try {
    const category = await createCourseCategory(
      req.body,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      message: "Course category created successfully",
      data: category,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const { status, search } = req.query;

    const categories = await getCourseCategories({
      status,
      search,
    });

    return res.status(200).json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve course categories",
    });
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await getCourseCategoryById(req.params.id);

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    const statusCode =
      error.message === "Course category not found" ? 404 : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await updateCourseCategory(
      req.params.id,
      req.body,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Course category updated successfully",
      data: category,
    });
  } catch (error) {
    const statusCode =
      error.message === "Course category not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCategoryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const category = await updateCourseCategoryStatus(
      req.params.id,
      status,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: `Course category status updated to ${status}`,
      data: category,
    });
  } catch (error) {
    const statusCode =
      error.message === "Course category not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  updateCategoryStatus,
};