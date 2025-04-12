const express = require("express");
const router = express.Router();
const {
  createCategory,
  getAllCategories,
    getCategoryById,
} = require("../../controllers/DSA/dsaCategoryController");

router.post("/", createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);


module.exports = router;
