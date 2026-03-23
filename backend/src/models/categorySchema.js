import mongoose from "mongoose";

/**
 * Schema for Product Categories.
 * @typedef {Object} Category
 * @property {string} name - The unique name of the category.
 * @property {Date} createdAt - Timestamp of creation.
 * @property {Date} updatedAt - Timestamp of last update.
 */
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);
export default Category;
