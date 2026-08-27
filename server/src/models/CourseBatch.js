const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CourseBatch = sequelize.define(
  "CourseBatch",
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

    batch_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "DRAFT",
        "UPCOMING",
        "ACTIVE",
        "COMPLETED",
        "CANCELLED",
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
    tableName: "course_batches",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = CourseBatch;