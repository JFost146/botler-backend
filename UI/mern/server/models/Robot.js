import mongoose from "mongoose";

const robotSchema = new mongoose.Schema({
  name: {
    type: String, //name of robot
    required: [true, "Robot name required"],
    trim: true, //removes spaces ("  ") from start and end
  },
  action: {
    type: String, //robot currebt action
    enum: ["serving", "taking order", "charging","awaiting instruction","fetching order"],
    default: "awaiting instruction",
  },
  batteryLevel: {
    type: Number, //possible battery monitoring capability
    min: 0,
    max: 100,
    default: 100,
  },
}, { timestamps: true });

//ensure name of robot is unique
robotSchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

const Robot = mongoose.model("Robot", robotSchema);

export default Robot;
