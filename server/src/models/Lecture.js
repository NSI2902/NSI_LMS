const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Lecture = sequelize.define(
  "Lecture",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    module_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    lecture_type: {
      type: DataTypes.ENUM("RECORDED", "LIVE"),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "DRAFT",
        "SCHEDULED",
        "LIVE",
        "COMPLETED",
        "RECORDING_AVAILABLE",
        "CANCELLED",
        "PUBLISHED"
      ),
      allowNull: false,
      defaultValue: "DRAFT",
    },

    display_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    scheduled_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    duration_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    meet_url: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },

    recording_url: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },

    recording_provider: {
      type: DataTypes.ENUM("GOOGLE_DRIVE", "S3"),
      allowNull: true,
    },

    recording_status: {
      type: DataTypes.ENUM("NOT_AVAILABLE", "AVAILABLE"),
      allowNull: false,
      defaultValue: "NOT_AVAILABLE",
    },

    published_at: {
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
    tableName: "lectures",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Lecture;