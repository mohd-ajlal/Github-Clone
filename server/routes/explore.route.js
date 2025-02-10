import express from "express";
import { 
  explorePopularRepos, 
  exploreTopUsers, 
  exploreTrendingRepos,
  exploreTopics,
  exploreByTopic
} from "../controllers/explore.controller.js";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated.js";
import { apiRateLimit } from "../middleware/rateLimit.js";

const router = express.Router();

router.get("/repos/:language", ensureAuthenticated, apiRateLimit(30), explorePopularRepos);
router.get("/trending", ensureAuthenticated, apiRateLimit(30), exploreTrendingRepos);
router.get("/users", ensureAuthenticated, apiRateLimit(30), exploreTopUsers);
router.get("/topics", ensureAuthenticated, apiRateLimit(30), exploreTopics);
router.get("/topic/:topic", ensureAuthenticated, apiRateLimit(30), exploreByTopic);

export default router;