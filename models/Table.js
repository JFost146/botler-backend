import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number, //tables numbered in a restaurant
    required: [true, "Table number is required"],
    unique: true, //table numbers are unique
  },
  headCount: {
    type: Number, //number of customers at a given table
    required: [true, "Amount of customers per table is required"], 
    min: [1, "Capacity must be at least 1"],
  },
  isOccupied: {
    type: Boolean, //bool to check table is available
    default: false, 
  },
}, { timestamps: true });

const Table = mongoose.model("Table", tableSchema);

export default Table;
