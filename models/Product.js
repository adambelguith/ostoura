import mongoose from "mongoose";

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true }
});
const Category = mongoose.models?.Category || mongoose.model("Category", categorySchema);
// Subcategory Schema
const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  nparentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }
});

const Subcategory = mongoose.models?.Subcategory ||mongoose.model("Subcategory", subcategorySchema);
// let Category = mongoose.models.Category;
// if (!Category) {
  // let Category = mongoose.model('Category', categorySchema);
// }

// let Subcategory = mongoose.models.Subcategory;
// if (!Subcategory) {
//   Subcategory = mongoose.model('Subcategory', subcategorySchema);
// }

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcategory',
      required: true
    },
    image: [{ type: String, required: true }],
    video:{type: String, required: true},
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    banner: String,
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models?.Product || mongoose.model("Product", productSchema);
  module.exports ={Product, Category, Subcategory} ;
