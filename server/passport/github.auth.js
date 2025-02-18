import passport from "passport";
import dotenv from "dotenv";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/user.model.js";

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:5000/api/auth/github/callback",
      scope: ["user:email", "read:user"]
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ username: profile.username });

        // Extract additional profile information
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : "";
        const bio = profile._json.bio || "";
        const location = profile._json.location || "";
        const company = profile._json.company || "";
        const followers = profile._json.followers || 0;
        const following = profile._json.following || 0;

        if (!user) {
          // Create new user
          const newUser = new User({
            name: profile.displayName,
            username: profile.username,
            email,
            bio,
            location,
            company,
            profileUrl: profile.profileUrl,
            avatarUrl: profile.photos[0].value,
            followers,
            following,
            likedProfiles: [],
            likedBy: [],
            starredRepos: [],
            pinnedRepos: [],
            lastActive: Date.now()
          });

          user = await newUser.save();
          done(null, user);
        } else {
          // Update existing user with latest GitHub data
          user.name = profile.displayName;
          user.email = email;
          user.bio = bio;
          user.location = location;
          user.company = company;
          user.profileUrl = profile.profileUrl;
          user.avatarUrl = profile.photos[0].value;
          user.followers = followers;
          user.following = following;
          user.lastActive = Date.now();

          await user.save();
          done(null, user);
        }
      } catch (error) {
        console.error("GitHub authentication error:", error);
        done(error, null);
      }
    }
  )
);
