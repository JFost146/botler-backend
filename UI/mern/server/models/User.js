import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: {
    type: String, //username from user
    required: [true, "Username required"],
    trim: true, //removes spaces ("  ") from start and end
  },
  password: {
    type: String, //password fromuser
    required: [true, "Password required"],
  },
  role: {
    type: String, //role of user, customer option may not be used
    enum: ["admin", "staff", "customer"],
    default: "staff",
  },
  lastLogin: {
    type: Date, //track last login of users for admin purposes
    default: null,
  },
}, { timestamps: true });


userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords during login
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//ensure username is unique
userSchema.index(
  { username: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

const User = mongoose.model("User", userSchema);

export default User;
