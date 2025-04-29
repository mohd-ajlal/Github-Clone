import express from "express";
import { 
  searchRepos,
  searchUsers,
  searchCode,
  searchIssues,
  searchAdvanced
} from "../controllers/search.controller.js";
import { apiRateLimit } from "../middleware/rateLimit.js";

const router = express.Router();

router.get("/repos", apiRateLimit(30), searchRepos);
router.get("/users", apiRateLimit(30), searchUsers);
router.get("/code", apiRateLimit(20), searchCode);
router.get("/issues", apiRateLimit(30), searchIssues);
router.post("/advanced", apiRateLimit(20), searchAdvanced);

export default router;