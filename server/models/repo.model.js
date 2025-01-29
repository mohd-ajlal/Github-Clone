import mongoose from "mongoose";

const repoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      required: true,
    },
    stars: {
      type: Number,
      default: 0,
    },
    forks: {
      type: Number,
      default: 0,
    },
    watchers: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
      default: "",
    },
    starredBy: {
      type: [String],
      default: [],
    },
    forkedBy: {
      type: [String],
      default: [],
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Repo = mongoose.model("Repo", repoSchema);
export default Repo;