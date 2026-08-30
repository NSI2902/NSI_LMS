const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Course = sequelize.define(
  "Course",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    course_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    category_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },

    thumbnail_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    duration_value: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    duration_unit: {
      type: DataTypes.ENUM(
        "DAYS",
        "WEEKS",
        "MONTHS"
      ),
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "DRAFT",
        "ACTIVE",
        "INACTIVE",
        "ARCHIVED"
      ),
      allowNull: false,
      defaultValue: "DRAFT",
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
    tableName: "courses",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Course;