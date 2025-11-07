import mongoose from "mongoose";

const allergenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Allergen is required"],
    trim: true, //allergen name
  },
  description: {
    type: String, //allergen description
    default: "",
  },
}, { timestamps: true });

//ensure name of allergen is unique
allergenSchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

const Allergen = mongoose.model("Allergen", allergenSchema);

export default Allergen;
