const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CourseStudent = sequelize.define(
  "CourseStudent",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    course_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    batch_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },

    student_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "ENROLLED",
        "INACTIVE",
        "COMPLETED",
        "DROPPED"
      ),
      allowNull: false,
      defaultValue: "ENROLLED",
    },

    enrolled_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    dropped_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    created_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },

    updated_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
  },
  {
    tableName: "course_students",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = CourseStudent;