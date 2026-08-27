const {
  Course,
  CourseModule,
} = require("../models");

const createModule = async ({
  courseId,
  title,
  description,
  display_order,
  userId,
}) => {
  const course = await Course.findByPk(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  const module = await CourseModule.create({
    course_id: courseId,
    title,
    description: description || null,
    display_order: display_order ?? 0,
    status: "DRAFT",
    created_by: userId || null,
    updated_by: userId || null,
  });

  return module;
};

const getModulesByCourse = async (courseId) => {
  const course = await Course.findByPk(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  return await CourseModule.findAll({
    where: {
      course_id: courseId,
    },
    order: [
      ["display_order", "ASC"],
      ["id", "ASC"],
    ],
  });
};

const getModuleById = async (moduleId) => {
  const module = await CourseModule.findByPk(moduleId);

  if (!module) {
    throw new Error("Course module not found");
  }

  return module;
};

const updateModule = async ({
  moduleId,
  title,
  description,
  display_order,
  userId,
}) => {
  const module = await CourseModule.findByPk(moduleId);

  if (!module) {
    throw new Error("Course module not found");
  }

  if (title !== undefined) {
    module.title = title;
  }

  if (description !== undefined) {
    module.description = description;
  }

  if (display_order !== undefined) {
    module.display_order = display_order;
  }

  module.updated_by = userId || null;

  await module.save();

  return module;
};

const updateModuleStatus = async ({
  moduleId,
  status,
  userId,
}) => {
  const module = await CourseModule.findByPk(moduleId);

  if (!module) {
    throw new Error("Course module not found");
  }

  module.status = status;
  module.updated_by = userId || null;

  if (status === "PUBLISHED") {
    module.published_at = new Date();
  } else {
    module.published_at = null;
  }

  await module.save();

  return module;
};

const updateModuleOrder = async ({
  moduleId,
  display_order,
  userId,
}) => {
  const module = await CourseModule.findByPk(moduleId);

  if (!module) {
    throw new Error("Course module not found");
  }

  module.display_order = display_order;
  module.updated_by = userId || null;

  await module.save();

  return module;
};

const deleteModule = async ({
  moduleId,
  userId,
}) => {
  const module = await CourseModule.findByPk(moduleId);

  if (!module) {
    throw new Error("Course module not found");
  }

  module.status = "ARCHIVED";
  module.updated_by = userId || null;

  await module.save();

  return module;
};

module.exports = {
  createModule,
  getModulesByCourse,
  getModuleById,
  updateModule,
  updateModuleStatus,
  updateModuleOrder,
  deleteModule,
};