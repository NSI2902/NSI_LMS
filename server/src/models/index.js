const User = require("./User");
const UserRole = require("./UserRole");
const CourseCategory = require("./CourseCategory");
const Course = require("./Course");
const CourseBatch = require("./CourseBatch");
const CourseInstructor = require("./CourseInstructor");
const CourseStudent = require("./CourseStudent");
const CourseModule = require("./CourseModule");
const Lecture = require("./Lecture");
const LectureNote = require("./LectureNote");

// User ↔ Role
UserRole.hasMany(User, {
  foreignKey: "role_id",
  as: "users",
});

User.belongsTo(UserRole, {
  foreignKey: "role_id",
  as: "role",
});

// Course ↔ Category
Course.belongsTo(CourseCategory, {
  foreignKey: "category_id",
  as: "category",
});

CourseCategory.hasMany(Course, {
  foreignKey: "category_id",
  as: "courses",
});

// Course ↔ Batch
CourseBatch.belongsTo(Course, {
  foreignKey: "course_id",
  as: "course",
});

Course.hasMany(CourseBatch, {
  foreignKey: "course_id",
  as: "batches",
});

// Course ↔ Modules
Course.hasMany(CourseModule, {
  foreignKey: "course_id",
  as: "modules",
});

CourseModule.belongsTo(Course, {
  foreignKey: "course_id",
  as: "course",
});

// Module ↔ Lectures
CourseModule.hasMany(Lecture, {
  foreignKey: "module_id",
  as: "lectures",
});

Lecture.belongsTo(CourseModule, {
  foreignKey: "module_id",
  as: "module",
});

// Lecture ↔ Notes
Lecture.hasMany(LectureNote, {
  foreignKey: "lecture_id",
  as: "notes",
});

LectureNote.belongsTo(Lecture, {
  foreignKey: "lecture_id",
  as: "lecture",
});

// Course Instructor
CourseInstructor.belongsTo(Course, {
  foreignKey: "course_id",
  as: "course",
});

CourseInstructor.belongsTo(CourseBatch, {
  foreignKey: "batch_id",
  as: "batch",
});

CourseInstructor.belongsTo(User, {
  foreignKey: "instructor_id",
  as: "instructor",
});

Course.hasMany(CourseInstructor, {
  foreignKey: "course_id",
  as: "instructors",
});

CourseBatch.hasMany(CourseInstructor, {
  foreignKey: "batch_id",
  as: "instructors",
});

User.hasMany(CourseInstructor, {
  foreignKey: "instructor_id",
  as: "courseAssignments",
});

// Course Student
CourseStudent.belongsTo(Course, {
  foreignKey: "course_id",
  as: "course",
});

CourseStudent.belongsTo(CourseBatch, {
  foreignKey: "batch_id",
  as: "batch",
});

CourseStudent.belongsTo(User, {
  foreignKey: "student_id",
  as: "student",
});

Course.hasMany(CourseStudent, {
  foreignKey: "course_id",
  as: "students",
});

CourseBatch.hasMany(CourseStudent, {
  foreignKey: "batch_id",
  as: "students",
});

User.hasMany(CourseStudent, {
  foreignKey: "student_id",
  as: "courseEnrollments",
});

module.exports = {
  User,
  UserRole,
  CourseCategory,
  Course,
  CourseBatch,
  CourseInstructor,
  CourseStudent,
  CourseModule,
  Lecture,
  LectureNote,
};