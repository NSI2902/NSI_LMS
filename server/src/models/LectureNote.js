const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const LectureNote = sequelize.define(
  "LectureNote",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    lecture_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    file_url: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },

    file_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "application/pdf",
    },

    file_size: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },

    storage_provider: {
      type: DataTypes.ENUM("GOOGLE_DRIVE", "S3"),
      allowNull: false,
      defaultValue: "GOOGLE_DRIVE",
    },

    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },

    display_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
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
    tableName: "lecture_notes",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = LectureNote;