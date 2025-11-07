import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Ingredient is required"],
    trim: true, //name of ingredient
  },
  allergens: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Allergen", //allergens for each ingredient reference allergen model
    }
  ],
  isAvailable: {
    type: Boolean,
    default: true, //may not use - use case is ingredient ran out but kitchen is unlikely to use the app
  },
}, { timestamps: true });

//ensure name of ingredient is unique
ingredientSchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

export default Ingredient;
