const {
  Course,
  CourseModule,
  Lecture,
} = require("../models");

/*
 * Create Lecture
 */
const createLecture = async ({
  moduleId,
  title,
  description,
  lecture_type,
  status,
  display_order,
  scheduled_at,
  duration_minutes,
  meet_url,
  recording_url,
  recording_provider,
  recording_status,
  userId,
}) => {
  const module = await CourseModule.findByPk(moduleId);

  if (!module) {
    throw new Error("Course module not found");
  }

  const lecture = await Lecture.create({
    module_id: moduleId,
    title,
    description: description || null,
    lecture_type,
    status: status || "DRAFT",
    display_order: display_order ?? 0,
    scheduled_at: scheduled_at || null,
    duration_minutes: duration_minutes || null,
    meet_url: meet_url || null,
    recording_url: recording_url || null,
    recording_provider: recording_provider || null,
    recording_status:
      recording_status || "NOT_AVAILABLE",
    published_at:
      status === "PUBLISHED" ? new Date() : null,
    created_by: userId || null,
    updated_by: userId || null,
  });

  return getLectureById(lecture.id);
};

/*
 * Get all lectures of a module
 */
const getLecturesByModule = async (moduleId) => {
  const module = await CourseModule.findByPk(moduleId);

  if (!module) {
    throw new Error("Course module not found");
  }

  return await Lecture.findAll({
    where: {
      module_id: moduleId,
    },
    order: [
      ["display_order", "ASC"],
      ["id", "ASC"],
    ],
  });
};

/*
 * Get single lecture
 */
const getLectureById = async (lectureId) => {
  const lecture = await Lecture.findByPk(lectureId, {
    include: [
      {
        model: CourseModule,
        as: "module",
        attributes: [
          "id",
          "course_id",
          "title",
          "status",
        ],
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
      },
    ],
  });

  if (!lecture) {
    throw new Error("Lecture not found");
  }

  return lecture;
};

/*
 * Update Lecture
 */
const updateLecture = async ({
  lectureId,
  title,
  description,
  lecture_type,
  scheduled_at,
  duration_minutes,
  meet_url,
  recording_url,
  recording_provider,
  recording_status,
  userId,
}) => {
  const lecture = await Lecture.findByPk(lectureId);

  if (!lecture) {
    throw new Error("Lecture not found");
  }

  if (title !== undefined) {
    lecture.title = title;
  }

  if (description !== undefined) {
    lecture.description = description;
  }

  if (lecture_type !== undefined) {
    lecture.lecture_type = lecture_type;
  }

  if (scheduled_at !== undefined) {
    lecture.scheduled_at = scheduled_at;
  }

  if (duration_minutes !== undefined) {
    lecture.duration_minutes = duration_minutes;
  }

  if (meet_url !== undefined) {
    lecture.meet_url = meet_url;
  }

  if (recording_url !== undefined) {
    lecture.recording_url = recording_url;
  }

  if (recording_provider !== undefined) {
    lecture.recording_provider =
      recording_provider;
  }

  if (recording_status !== undefined) {
    lecture.recording_status =
      recording_status;
  }

  lecture.updated_by = userId || null;

  await lecture.save();

  return getLectureById(lecture.id);
};

/*
 * Update Lecture Status
 */
const updateLectureStatus = async ({
  lectureId,
  status,
  userId,
}) => {
  const lecture = await Lecture.findByPk(lectureId);

  if (!lecture) {
    throw new Error("Lecture not found");
  }

  lecture.status = status;

  if (status === "PUBLISHED") {
    lecture.published_at = new Date();
  } else if (status !== "PUBLISHED") {
    lecture.published_at = null;
  }

  lecture.updated_by = userId || null;

  await lecture.save();

  return getLectureById(lecture.id);
};

/*
 * Update Lecture Order
 */
const updateLectureOrder = async ({
  lectureId,
  display_order,
  userId,
}) => {
  const lecture = await Lecture.findByPk(lectureId);

  if (!lecture) {
    throw new Error("Lecture not found");
  }

  lecture.display_order = display_order;
  lecture.updated_by = userId || null;

  await lecture.save();

  return getLectureById(lecture.id);
};

/*
 * Archive Lecture
 */
const deleteLecture = async ({
  lectureId,
  userId,
}) => {
  const lecture = await Lecture.findByPk(lectureId);

  if (!lecture) {
    throw new Error("Lecture not found");
  }

  lecture.status = "CANCELLED";
  lecture.updated_by = userId || null;

  await lecture.save();

  return getLectureById(lecture.id);
};

module.exports = {
  createLecture,
  getLecturesByModule,
  getLectureById,
  updateLecture,
  updateLectureStatus,
  updateLectureOrder,
  deleteLecture,
};