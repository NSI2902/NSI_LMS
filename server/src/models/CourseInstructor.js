const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CourseInstructor = sequelize.define(
  "CourseInstructor",
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

    instructor_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },

    assigned_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
    tableName: "course_instructors",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = CourseInstructor;