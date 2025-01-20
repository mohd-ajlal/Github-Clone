const passport = require("passport");
const dotenv = require('dotenv');
const { Strategy: GitHubStrategy } = require("passport-github2");
const User = require("../models/user.model");

dotenv.config();

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/api/auth/github/callback",
        },
        async function (accessToken, refreshToken, profile, done) {
            try {
                let user = await User.findOne({ username: profile.username });
                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        username: profile.username,
                        profileUrl: profile.profileUrl,
                        avatarUrl: profile.photos[0].value,
                        likedProfiles: [],
                        likedBy: [],
                    });
                    await user.save();
                }
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
);