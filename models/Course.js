const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/connectdb");

const Course = sequelize.define("Course", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
});

module.exports = Course;
