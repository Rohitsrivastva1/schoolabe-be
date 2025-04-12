const DsaCategory = require("../../models/DSA/DsaCategory");

exports.createCategory = async (req, res) => {
    try {
      const { name, description } = req.body;
  
      // 🔁 Check if category already exists
      const existingCategory = await DsaCategory.findOne({ where: { name } });
      if (existingCategory) {
        return res.status(400).json({ error: "⚠️ Category name already exists!" });
      }
  
      // ✅ Create new category
      const category = await DsaCategory.create({ name, description });
      res.status(201).json(category);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await DsaCategory.findAll();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getCategoryById = async (req, res) => {
    try {
      const { id } = req.params;
      const category = await DsaCategory.findByPk(id);
  
      if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
  
      res.json({ success: true, category });
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };