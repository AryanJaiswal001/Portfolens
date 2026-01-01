import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name not to exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      minlength: [8, "Password must be atleast 8 characters"],
      select: false,
      default: null,
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    providerId: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: false,
    },
    onboardingComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });
userSchema.index({ provider: 1, providerId: 1 });

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user._v;
  return user;
};

const User = mongoose.model("User", userSchema);

export default User;
