import express from "express";
import { 
  getRepoDetails,
  starRepo,
  unstarRepo,
  forkRepo,
  getStargazers,
  getForkers,
  getRepoContributors,
  getRepoLanguages,
  getRepoIssues,
  getRepoPullRequests
} from "../controllers/repo.controller.js";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated.js";
import { apiRateLimit } from "../middleware/rateLimit.js";

const router = express.Router();

router.get("/:owner/:repo", apiRateLimit(100), getRepoDetails);
router.post("/star/:owner/:repo", ensureAuthenticated, starRepo);
router.post("/unstar/:owner/:repo", ensureAuthenticated, unstarRepo);
router.post("/fork/:owner/:repo", ensureAuthenticated, forkRepo);
router.get("/stargazers/:owner/:repo", apiRateLimit(50), getStargazers);
router.get("/forks/:owner/:repo", apiRateLimit(50), getForkers);
router.get("/contributors/:owner/:repo", apiRateLimit(50), getRepoContributors);
router.get("/languages/:owner/:repo", apiRateLimit(50), getRepoLanguages);
router.get("/issues/:owner/:repo", apiRateLimit(50), getRepoIssues);
router.get("/pulls/:owner/:repo", apiRateLimit(50), getRepoPullRequests);

export default router;