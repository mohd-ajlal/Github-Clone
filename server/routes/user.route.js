import express from "express";
import { 
  getUserProfileAndRepos, 
  likeProfile, 
  getLikes, 
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  updateUserProfile,
  getUserStats,
  getUserActivity,
  getPinnedRepos
} from "../controllers/user.controller.js";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated.js";
import { apiRateLimit } from "../middleware/rateLimit.js";

const router = express.Router();

router.get("/profile/:username", apiRateLimit(100), getUserProfileAndRepos);
router.get("/likes", ensureAuthenticated, getLikes);
router.post("/like/:username", ensureAuthenticated, likeProfile);
router.post("/follow/:username", ensureAuthenticated, followUser);
router.post("/unfollow/:username", ensureAuthenticated, unfollowUser);
router.get("/followers", ensureAuthenticated, getFollowers);
router.get("/following", ensureAuthenticated, getFollowing);
router.put("/profile", ensureAuthenticated, updateUserProfile);
router.get("/stats", ensureAuthenticated, getUserStats);
router.get("/activity", ensureAuthenticated, getUserActivity);
router.get("/pinned-repos", ensureAuthenticated, getPinnedRepos);

export default router;