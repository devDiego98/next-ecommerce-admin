import mongoose, { model, Schema, models } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true },
  parentCategory: {
    name: { type: String },
    _id: { type: mongoose.Types.ObjectId, required: false },
    properties: [{ type: Object }],
  },
  properties: { type: [{ type: Object }] },
});

const Category = models.Category || model("Category", CategorySchema);
export default Category;
