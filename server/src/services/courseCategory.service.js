const { Op } = require("sequelize");
const { CourseCategory } = require("../models");

const createCourseCategory = async (categoryData, adminId) => {
  const name = categoryData.name.trim();

  const existingCategory = await CourseCategory.findOne({
    where: {
      name: {
        [Op.eq]: name,
      },
    },
  });

  if (existingCategory) {
    throw new Error("Course category already exists");
  }

  const category = await CourseCategory.create({
    name,
    description: categoryData.description?.trim() || null,
    status: categoryData.status || "ACTIVE",
    created_by: adminId,
    updated_by: adminId,
  });

  return category;
};

const getCourseCategories = async (filters = {}) => {
  const where = {};

  if (filters.status && filters.status !== "ALL") {
    where.status = filters.status;
  }

  if (filters.search && filters.search.trim()) {
    where.name = {
      [Op.like]: `%${filters.search.trim()}%`,
    };
  }

  return CourseCategory.findAll({
    where,
    order: [["created_at", "DESC"]],
  });
};

const getCourseCategoryById = async (id) => {
  const category = await CourseCategory.findByPk(id);

  if (!category) {
    throw new Error("Course category not found");
  }

  return category;
};

const updateCourseCategory = async (id, categoryData, adminId) => {
  const category = await CourseCategory.findByPk(id);

  if (!category) {
    throw new Error("Course category not found");
  }

  if (categoryData.name !== undefined) {
    const name = categoryData.name.trim();

    const existingCategory = await CourseCategory.findOne({
      where: {
        name,
        id: {
          [Op.ne]: id,
        },
      },
    });

    if (existingCategory) {
      throw new Error("Course category already exists");
    }

    category.name = name;
  }

  if (categoryData.description !== undefined) {
    category.description = categoryData.description?.trim() || null;
  }

  category.updated_by = adminId;

  await category.save();

  return category;
};

const updateCourseCategoryStatus = async (id, status, adminId) => {
  const validStatuses = ["ACTIVE", "INACTIVE"];

  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status. Allowed values: ACTIVE, INACTIVE");
  }

  const category = await CourseCategory.findByPk(id);

  if (!category) {
    throw new Error("Course category not found");
  }

  category.status = status;
  category.updated_by = adminId;

  await category.save();

  return category;
};

module.exports = {
  createCourseCategory,
  getCourseCategories,
  getCourseCategoryById,
  updateCourseCategory,
  updateCourseCategoryStatus,
};