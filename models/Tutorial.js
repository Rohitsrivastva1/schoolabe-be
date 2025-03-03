const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/connectdb");
const Course = require("./Course");

const Tutorial = sequelize.define("Tutorial", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.JSONB, // Store JSON objects as an array
    allowNull: false,
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Course,
      key: "id",
    },
    onDelete: "CASCADE",
  },
});

// Relationship: A Course has many Tutorials
Course.hasMany(Tutorial, { foreignKey: "courseId", onDelete: "CASCADE" });
Tutorial.belongsTo(Course, { foreignKey: "courseId" });

module.exports = Tutorial;
