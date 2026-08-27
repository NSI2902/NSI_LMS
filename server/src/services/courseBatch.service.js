const { Op } = require("sequelize");
const {
  Course,
  CourseBatch,
} = require("../models");

const createCourseBatch = async (courseId, batchData, adminId) => {
  const course = await Course.findByPk(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  const batchCode = batchData.batch_code.trim();

  const existingBatch = await CourseBatch.findOne({
    where: {
      course_id: courseId,
      batch_code: batchCode,
    },
  });

  if (existingBatch) {
    throw new Error(
      "Batch code already exists for this course"
    );
  }

  const batch = await CourseBatch.create({
    course_id: courseId,
    batch_code: batchCode,
    name: batchData.name.trim(),
    description: batchData.description?.trim() || null,
    start_date: batchData.start_date || null,
    end_date: batchData.end_date || null,
    status: batchData.status || "DRAFT",
    created_by: adminId,
    updated_by: adminId,
  });

  return CourseBatch.findByPk(batch.id, {
    include: [
      {
        model: Course,
        as: "course",
        attributes: [
          "id",
          "course_code",
          "name",
          "status",
        ],
      },
    ],
  });
};

const getCourseBatches = async (courseId, filters = {}) => {
  const course = await Course.findByPk(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  const where = {
    course_id: courseId,
  };

  if (filters.status && filters.status !== "ALL") {
    where.status = filters.status;
  }

  if (filters.search && filters.search.trim()) {
    where[Op.or] = [
      {
        name: {
          [Op.like]: `%${filters.search.trim()}%`,
        },
      },
      {
        batch_code: {
          [Op.like]: `%${filters.search.trim()}%`,
        },
      },
    ];
  }

  return CourseBatch.findAll({
    where,
    include: [
      {
        model: Course,
        as: "course",
        attributes: [
          "id",
          "course_code",
          "name",
          "status",
        ],
      },
    ],
    order: [["created_at", "DESC"]],
  });
};

const getCourseBatchById = async (id) => {
  const batch = await CourseBatch.findByPk(id, {
    include: [
      {
        model: Course,
        as: "course",
        attributes: [
          "id",
          "course_code",
          "name",
          "status",
        ],
      },
    ],
  });

  if (!batch) {
    throw new Error("Batch not found");
  }

  return batch;
};

const updateCourseBatch = async (
  id,
  batchData,
  adminId
) => {
  const batch = await CourseBatch.findByPk(id);

  if (!batch) {
    throw new Error("Batch not found");
  }

  if (batchData.batch_code !== undefined) {
    const batchCode = batchData.batch_code.trim();

    const existingBatch = await CourseBatch.findOne({
      where: {
        course_id: batch.course_id,
        batch_code: batchCode,
        id: {
          [Op.ne]: id,
        },
      },
    });

    if (existingBatch) {
      throw new Error(
        "Batch code already exists for this course"
      );
    }

    batch.batch_code = batchCode;
  }

  if (batchData.name !== undefined) {
    batch.name = batchData.name.trim();
  }

  if (batchData.description !== undefined) {
    batch.description =
      batchData.description?.trim() || null;
  }

  if (batchData.start_date !== undefined) {
    batch.start_date = batchData.start_date || null;
  }

  if (batchData.end_date !== undefined) {
    batch.end_date = batchData.end_date || null;
  }

  batch.updated_by = adminId;

  await batch.save();

  return getCourseBatchById(id);
};

const updateCourseBatchStatus = async (
  id,
  status,
  adminId
) => {
  const validStatuses = [
    "DRAFT",
    "UPCOMING",
    "ACTIVE",
    "COMPLETED",
    "CANCELLED",
    "ARCHIVED",
  ];

  if (!validStatuses.includes(status)) {
    throw new Error("Invalid batch status");
  }

  const batch = await CourseBatch.findByPk(id);

  if (!batch) {
    throw new Error("Batch not found");
  }

  batch.status = status;
  batch.updated_by = adminId;

  await batch.save();

  return getCourseBatchById(id);
};

module.exports = {
  createCourseBatch,
  getCourseBatches,
  getCourseBatchById,
  updateCourseBatch,
  updateCourseBatchStatus,
};