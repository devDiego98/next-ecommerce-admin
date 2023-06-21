import mongoose, { model, Schema, models } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true },
  parentCategory: { type: Array },
  properties: { type: [{ type: Object }] },
});

const Category = models.Category || model("Category", CategorySchema);
export default Category;
