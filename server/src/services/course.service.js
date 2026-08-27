const { Op } = require("sequelize");
const { Course, CourseCategory } = require("../models");

const createCourse = async (courseData, adminId) => {
  const courseCode = courseData.course_code.trim();

  const existingCourse = await Course.findOne({
    where: {
      course_code: courseCode,
    },
  });

  if (existingCourse) {
    throw new Error("Course code already exists");
  }

  if (courseData.category_id) {
    const category = await CourseCategory.findByPk(
      courseData.category_id
    );

    if (!category) {
      throw new Error("Course category not found");
    }

    if (category.status !== "ACTIVE") {
      throw new Error("Selected course category is inactive");
    }
  }

  const course = await Course.create({
    course_code: courseCode,
    name: courseData.name.trim(),
    description: courseData.description?.trim() || null,
    category_id: courseData.category_id || null,
    thumbnail_url: courseData.thumbnail_url?.trim() || null,
    duration_value: courseData.duration_value || null,
    duration_unit: courseData.duration_unit || null,
    status: courseData.status || "DRAFT",
    created_by: adminId,
    updated_by: adminId,
  });

  return Course.findByPk(course.id, {
    include: [
      {
        model: CourseCategory,
        as: "category",
        attributes: ["id", "name", "status"],
      },
    ],
  });
};

const getCourses = async (filters = {}) => {
  const where = {};

  if (filters.status && filters.status !== "ALL") {
    where.status = filters.status;
  }

  if (filters.category_id) {
    where.category_id = filters.category_id;
  }

  if (filters.search && filters.search.trim()) {
    where[Op.or] = [
      {
        name: {
          [Op.like]: `%${filters.search.trim()}%`,
        },
      },
      {
        course_code: {
          [Op.like]: `%${filters.search.trim()}%`,
        },
      },
    ];
  }

  return Course.findAll({
    where,
    include: [
      {
        model: CourseCategory,
        as: "category",
        attributes: ["id", "name", "status"],
      },
    ],
    order: [["created_at", "DESC"]],
  });
};

const getCourseById = async (id) => {
  const course = await Course.findByPk(id, {
    include: [
      {
        model: CourseCategory,
        as: "category",
        attributes: ["id", "name", "status"],
      },
    ],
  });

  if (!course) {
    throw new Error("Course not found");
  }

  return course;
};

const updateCourse = async (id, courseData, adminId) => {
  const course = await Course.findByPk(id);

  if (!course) {
    throw new Error("Course not found");
  }

  if (courseData.course_code !== undefined) {
    const courseCode = courseData.course_code.trim();

    const existingCourse = await Course.findOne({
      where: {
        course_code: courseCode,
        id: {
          [Op.ne]: id,
        },
      },
    });

    if (existingCourse) {
      throw new Error("Course code already exists");
    }

    course.course_code = courseCode;
  }

  if (courseData.name !== undefined) {
    course.name = courseData.name.trim();
  }

  if (courseData.description !== undefined) {
    course.description =
      courseData.description?.trim() || null;
  }

  if (courseData.category_id !== undefined) {
    if (courseData.category_id === null) {
      course.category_id = null;
    } else {
      const category = await CourseCategory.findByPk(
        courseData.category_id
      );

      if (!category) {
        throw new Error("Course category not found");
      }

      if (category.status !== "ACTIVE") {
        throw new Error("Selected course category is inactive");
      }

      course.category_id = courseData.category_id;
    }
  }

  if (courseData.thumbnail_url !== undefined) {
    course.thumbnail_url =
      courseData.thumbnail_url?.trim() || null;
  }

  if (courseData.duration_value !== undefined) {
    course.duration_value =
      courseData.duration_value || null;
  }

  if (courseData.duration_unit !== undefined) {
    course.duration_unit =
      courseData.duration_unit || null;
  }

  course.updated_by = adminId;

  await course.save();

  return getCourseById(id);
};

const updateCourseStatus = async (id, status, adminId) => {
  const validStatuses = [
    "DRAFT",
    "ACTIVE",
    "INACTIVE",
    "ARCHIVED",
  ];

  if (!validStatuses.includes(status)) {
    throw new Error("Invalid course status");
  }

  const course = await Course.findByPk(id);

  if (!course) {
    throw new Error("Course not found");
  }

  course.status = status;
  course.updated_by = adminId;

  await course.save();

  return getCourseById(id);
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  updateCourseStatus,
};