import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    company: {
      type: String,
      default: "",
    },
    profileUrl: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
    },
    followers: {
      type: Number,
      default: 0,
    },
    following: {
      type: Number,
      default: 0,
    },
    likedProfiles: {
      type: [String],
      default: [],
    },
    likedBy: [
      {
        username: {
          type: String,
          required: true,
        },
        avatarUrl: {
          type: String,
        },
        likedDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    starredRepos: {
      type: [String],
      default: [],
    },
    pinnedRepos: {
      type: [String],
      default: [],
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;