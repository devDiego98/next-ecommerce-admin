import mongoose, { model, Schema, models } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true },
  desc: String,
  price: { type: Number, required: true },
  images: { type: Array, required: true },
  category: { type: Array },
  properties: { type: Object },
});

const Product = models.Product || model("Product", ProductSchema);
export default Product;
