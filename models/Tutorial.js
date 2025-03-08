const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/connectdb");
const Course = require("./Course");

const Tutorial = sequelize.define("Tutorial", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  content: {
    type: DataTypes.JSONB,
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

Course.hasMany(Tutorial, { foreignKey: "courseId", onDelete: "CASCADE" });
Tutorial.belongsTo(Course, { foreignKey: "courseId" });

module.exports = Tutorial;
