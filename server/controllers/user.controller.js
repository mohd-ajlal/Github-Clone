import User from "../models/user.model.js";
import Repo from "../models/repo.model.js";

export const getUserProfileAndRepos = async (req, res) => {
  const { username } = req.params;
  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        authorization: `token ${process.env.GITHUB_API_KEY}`,
      },
    });
    
    if (!userRes.ok) {
      return res.status(userRes.status).json({ 
        error: `GitHub API Error: ${userRes.statusText}` 
      });
    }
    
    const userProfile = await userRes.json();
    
    const repoRes = await fetch(userProfile.repos_url, {
      headers: {
        authorization: `token ${process.env.GITHUB_API_KEY}`,
      },
    });
    
    if (!repoRes.ok) {
      return res.status(repoRes.status).json({ 
        error: `GitHub API Error: ${repoRes.statusText}` 
      });
    }
    
    const repos = await repoRes.json();
    
    const user = await User.findOne({ username });
    
    if (user) {
      userProfile.isLiked = req.user?.likedProfiles?.includes(username) || false;
    }
    
    res.status(200).json({ userProfile, repos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const likeProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findById(req.user._id.toString());
    
    const userToLike = await User.findOne({ username });
    
    if (!userToLike) {
      return res.status(404).json({ error: "User is not a member" });
    }
    
    if (user.likedProfiles.includes(userToLike.username)) {
      return res.status(400).json({ error: "User already liked" });
    }
    
    userToLike.likedBy.push({ 
      username: user.username, 
      avatarUrl: user.avatarUrl, 
      likedDate: Date.now() 
    });
    
    user.likedProfiles.push(userToLike.username);
    
    await Promise.all([userToLike.save(), user.save()]);
    
    res.status(200).json({ 
      success: true,
      message: "User liked successfully" 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLikes = async (req, res) => {
  try {
    const user = await User.findById(req.user._id.toString());
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(200).json({ 
      likedBy: user.likedBy,
      likedProfiles: user.likedProfiles 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const followUser = async (req, res) => {
  try {
    const { username } = req.params;
    
    if (req.user.username === username) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }
    
    const response = await fetch(`https://api.github.com/user/following/${username}`, {
      method: 'PUT',
      headers: {
        authorization: `token ${process.env.GITHUB_API_KEY}`,
        'Content-Length': '0'
      },
    });
    
    if (response.status === 204) {
      res.status(200).json({ success: true, message: `You are now following ${username}` });
    } else {
      res.status(response.status).json({ 
        error: `Failed to follow user: ${response.statusText}` 
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const { username } = req.params;
    
    const response = await fetch(`https://api.github.com/user/following/${username}`, {
      method: 'DELETE',
      headers: {
        authorization: `token ${process.env.GITHUB_API_KEY}`
      },
    });
    
    if (response.status === 204) {
      res.status(200).json({ success: true, message: `You have unfollowed ${username}` });
    } else {
      res.status(response.status).json({ 
        error: `Failed to unfollow user: ${response.statusText}` 
      });
    }
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const username = req.query.username || req.user.username;
    
    const response = await fetch(`https://api.github.com/users/${username}/followers`, {
      headers: {
        authorization: `token ${process.env.GITHUB_API_KEY}`
      },
    });
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `GitHub API Error: ${response.statusText}` 
      });
    }
    
    const followers = await response.json();
    res.status(200).json({ followers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const username = req.query.username || req.user.username;
    
    const response = await fetch(`https://api.github.com/users/${username}/following`, {
      headers: {
        authorization: `token ${process.env.GITHUB_API_KEY}`
      },
    });
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `GitHub API Error: ${response.statusText}` 
      });
    }
    
    const following = await response.json();
    res.status(200).json({ following });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { bio, company, location } = req.body;
    const user = await User.findById(req.user._id.toString());
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    if (bio !== undefined) user.bio = bio;
    if (company !== undefined) user.company = company;
    if (location !== undefined) user.location = location;
    
    user.lastActive = Date.now();
    
    await user.save();
    
    res.status(200).json({ 
      success: true, 
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserActivity = async (req, res) => {
  try {
    const username = req.query.username || req.user.username;
    
    const response = await fetch(`https://api.github.com/users/${username}/events/public?per_page=30`, {
      headers: {
        authorization: `token ${process.env.GITHUB_API_KEY}`
      },
    });
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `GitHub API Error: ${response.statusText}` 
      });
    }
    
    const events = await response.json();
    
    // Process and enhance the events data
    const processedEvents = events.map(event => {
      const processed = {
        id: event.id,
        type: event.type,
        actor: event.actor,
        repo: event.repo,
        created_at: event.created_at
      };
      
      // Add specific payload data based on event type
      switch(event.type) {
        case 'PushEvent':
          processed.commits = event.payload.commits;
          processed.ref = event.payload.ref;
          break;
        case 'PullRequestEvent':
          processed.action = event.payload.action;
          processed.number = event.payload.number;
          processed.title = event.payload.pull_request.title;
          break;
        case 'IssuesEvent':
          processed.action = event.payload.action;
          processed.number = event.payload.issue.number;
          processed.title = event.payload.issue.title;
          break;
        case 'CreateEvent':
          processed.ref_type = event.payload.ref_type;
          processed.ref = event.payload.ref;
          break;
        case 'ForkEvent':
          processed.forkee = {
            name: event.payload.forkee.name,
            full_name: event.payload.forkee.full_name,
            html_url: event.payload.forkee.html_url
          };
          break;
        case 'WatchEvent':
          processed.action = event.payload.action;
          break;
      }
      
      return processed;
    });
    
    res.status(200).json({ activity: processedEvents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPinnedRepos = async (req, res) => {
  try {
    const username = req.query.username || req.user.username;
    
    // First check if the user exists in our database
    const user = await User.findOne({ username });
    
    // If user has pinned repos in our database, use those
    if (user && user.pinnedRepos && user.pinnedRepos.length > 0) {
      const pinnedReposPromises = user.pinnedRepos.map(repoName => {
        return fetch(`https://api.github.com/repos/${username}/${repoName}`, {
          headers: {
            authorization: `token ${process.env.GITHUB_API_KEY}`
          }
        }).then(res => res.json());
      });
      
      const pinnedRepos = await Promise.all(pinnedReposPromises);
      return res.status(200).json({ pinnedRepos });
    }
    
    // Otherwise, fetch user's repositories and pick top ones based on stars
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=6`, {
      headers: {
        authorization: `token ${process.env.GITHUB_API_KEY}`
      }
    });
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `GitHub API Error: ${response.statusText}` 
      });
    }
    
    const repos = await response.json();
    
    res.status(200).json({ pinnedRepos: repos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const username = req.query.username || req.user.username;
    
    const [userRes, reposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: { authorization: `token ${process.env.GITHUB_API_KEY}` }
      }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
        headers: { authorization: `token ${process.env.GITHUB_API_KEY}` }
      }),
      fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, {
        headers: { authorization: `token ${process.env.GITHUB_API_KEY}` }
      })
    ]);
    
    if (!userRes.ok || !reposRes.ok || !eventsRes.ok) {
      return res.status(404).json({ error: "Failed to fetch user data" });
    }
    
    const [user, repos, events] = await Promise.all([
      userRes.json(),
      reposRes.json(),
      eventsRes.json()
    ]);
    
    // Calculate stats
    const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
    const totalForks = repos.reduce((acc, repo) => acc + repo.forks_count, 0);
    const totalWatchers = repos.reduce((acc, repo) => acc + repo.watchers_count, 0);
    
    // Calculate language stats
    const languages = {};
    repos.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });
    
    // Calculate contribution stats
    const contributions = {
      commits: 0,
      pullRequests: 0,
      issues: 0,
      reviews: 0
    };
    
    events.forEach(event => {
      switch (event.type) {
        case 'PushEvent':
          contributions.commits += event.payload.commits?.length || 0;
          break;
        case 'PullRequestEvent':
          contributions.pullRequests++;
          break;
        case 'IssuesEvent':
          contributions.issues++;
          break;
        case 'PullRequestReviewEvent':
          contributions.reviews++;
          break;
      }
    });
    
    res.status(200).json({
      profile: {
        followers: user.followers,
        following: user.following,
        public_repos: user.public_repos,
        public_gists: user.public_gists
      },
      repos: {
        totalStars,
        totalForks,
        totalWatchers,
        count: repos.length,
        languages
      },
      contributions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};