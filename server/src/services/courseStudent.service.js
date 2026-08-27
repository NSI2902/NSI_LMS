const {
  Course,
  CourseBatch,
  CourseStudent,
  User,
  UserRole,
} = require("../models");

const enrollStudent = async (
  batchId,
  studentId,
  adminId
) => {
  const batch = await CourseBatch.findByPk(batchId);

  if (!batch) {
    throw new Error("Batch not found");
  }

  const student = await User.findByPk(studentId, {
    include: [
      {
        model: UserRole,
        as: "role",
        attributes: ["id", "name"],
      },
    ],
  });

  if (!student) {
    throw new Error("Student user not found");
  }

  if (!student.role || student.role.name !== "STUDENT") {
    throw new Error(
      "Selected user does not have STUDENT role"
    );
  }

  if (student.status !== "ACTIVE") {
    throw new Error(
      "Student account is not active"
    );
  }

  const existingEnrollment =
    await CourseStudent.findOne({
      where: {
        course_id: batch.course_id,
        batch_id: batch.id,
        student_id: studentId,
      },
    });

  if (existingEnrollment) {
    if (existingEnrollment.status === "ENROLLED") {
      throw new Error(
        "Student is already enrolled in this batch"
      );
    }

    existingEnrollment.status = "ENROLLED";
    existingEnrollment.enrolled_at = new Date();
    existingEnrollment.completed_at = null;
    existingEnrollment.dropped_at = null;
    existingEnrollment.updated_by = adminId;

    await existingEnrollment.save();

    return getEnrollmentById(
      existingEnrollment.id
    );
  }

  const enrollment = await CourseStudent.create({
    course_id: batch.course_id,
    batch_id: batch.id,
    student_id: studentId,
    status: "ENROLLED",
    enrolled_at: new Date(),
    created_by: adminId,
    updated_by: adminId,
  });

  return getEnrollmentById(enrollment.id);
};

const getStudentsByBatch = async (batchId) => {
  const batch = await CourseBatch.findByPk(batchId);

  if (!batch) {
    throw new Error("Batch not found");
  }

  return CourseStudent.findAll({
    where: {
      batch_id: batchId,
    },

    include: [
      {
        model: User,
        as: "student",
        attributes: [
          "id",
          "first_name",
          "last_name",
          "email",
          "username",
          "status",
        ],
        include: [
          {
            model: UserRole,
            as: "role",
            attributes: ["id", "name"],
          },
        ],
      },

      {
        model: Course,
        as: "course",
        attributes: [
          "id",
          "course_code",
          "name",
        ],
      },

      {
        model: CourseBatch,
        as: "batch",
        attributes: [
          "id",
          "batch_code",
          "name",
        ],
      },
    ],

    order: [["enrolled_at", "DESC"]],
  });
};

const getEnrollmentById = async (id) => {
  const enrollment =
    await CourseStudent.findByPk(id, {
      include: [
        {
          model: User,
          as: "student",
          attributes: [
            "id",
            "first_name",
            "last_name",
            "email",
            "username",
            "status",
          ],
          include: [
            {
              model: UserRole,
              as: "role",
              attributes: ["id", "name"],
            },
          ],
        },

        {
          model: Course,
          as: "course",
          attributes: [
            "id",
            "course_code",
            "name",
          ],
        },

        {
          model: CourseBatch,
          as: "batch",
          attributes: [
            "id",
            "batch_code",
            "name",
          ],
        },
      ],
    });

  if (!enrollment) {
    throw new Error("Student enrollment not found");
  }

  return enrollment;
};

const updateEnrollmentStatus = async (
  batchId,
  studentId,
  status,
  adminId
) => {
  const allowedStatuses = [
    "ENROLLED",
    "INACTIVE",
    "COMPLETED",
    "DROPPED",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid enrollment status");
  }

  const enrollment =
    await CourseStudent.findOne({
      where: {
        batch_id: batchId,
        student_id: studentId,
      },
    });

  if (!enrollment) {
    throw new Error(
      "Student enrollment not found"
    );
  }

  enrollment.status = status;
  enrollment.updated_by = adminId;

  if (status === "COMPLETED") {
    enrollment.completed_at = new Date();
    enrollment.dropped_at = null;
  }

  if (status === "DROPPED") {
    enrollment.dropped_at = new Date();
    enrollment.completed_at = null;
  }

  if (status === "ENROLLED") {
    enrollment.dropped_at = null;
    enrollment.completed_at = null;
    enrollment.enrolled_at =
      enrollment.enrolled_at || new Date();
  }

  await enrollment.save();

  return getEnrollmentById(enrollment.id);
};

const removeStudent = async (
  batchId,
  studentId,
  adminId
) => {
  const enrollment =
    await CourseStudent.findOne({
      where: {
        batch_id: batchId,
        student_id: studentId,
      },
    });

  if (!enrollment) {
    throw new Error(
      "Student enrollment not found"
    );
  }

  enrollment.status = "INACTIVE";
  enrollment.updated_by = adminId;

  await enrollment.save();

  return enrollment;
};

module.exports = {
  enrollStudent,
  getStudentsByBatch,
  getEnrollmentById,
  updateEnrollmentStatus,
  removeStudent,
};