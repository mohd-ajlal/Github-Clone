import dotenv from "dotenv";
dotenv.config();

import User from "../models/user.model.js";
import Repo from "../models/repo.model.js";

export const getRepoDetails = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    
    const [repoRes, readmeRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          authorization: `token ${process.env.GITHUB_API_KEY}`,
        },
      }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
        headers: {
          authorization: `token ${process.env.GITHUB_API_KEY}`,
        },
      }).catch(() => null) // Readme might not exist
    ]);
    
    if (!repoRes.ok) {
      return res.status(repoRes.status).json({ 
        error: `GitHub API Error: ${repoRes.statusText}` 
      });
    }
    
    const repoData = await repoRes.json();
    
    // Add readme content if available
    let readmeContent = null;
    if (readmeRes && readmeRes.ok) {
      const readmeData = await readmeRes.json();
      readmeContent = Buffer.from(readmeData.content, 'base64').toString('utf8');
    }
    
    // Check if user has starred this repo
    let isStarred = false;
    if (req.isAuthenticated()) {
      const user = await User.findById(req.user._id.toString());
      isStarred = user.starredRepos.includes(`${owner}/${repo}`);
    }
    
    res.status(200).json({ 
      repo: repoData, 
      readme: readmeContent,
      isStarred
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const starRepo = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    
    // Star the repo on GitHub
    const response = await fetch(`https://api.github.com/user/starred/${owner}/${repo}`, {
      method: 'PUT',
      headers: {
        authorization: `token ${process.env.GITHUB_API_KEY}`,
        'Content-Length': '0'
      },
    });

    console.log("Token:", process.env.GITHUB_API_KEY);
    console.log("Response:", response); // Log the response object
    
    if (response.status !== 204) {
      return res.status(response.status).json({ 
        error: `GitHub API Error: ${response.statusText}` 
      });
    }
    
    // Track the starred repo in our database
    const user = await User.findById(req.user._id.toString());
    const repoFullName = `${owner}/${repo}`;
    
    if (!user.starredRepos.includes(repoFullName)) {
      user.starredRepos.push(repoFullName);
      await user.save();
    }
    
    // Check if repo exists in our database, if not create it
    const existingRepo = await Repo.findOne({ fullName: repoFullName });
    
    if (!existingRepo) {
      const repoDetailsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          authorization: `token ${process.env.GITHUB_API_KEY}`,
        },
      });
      
      if (repoDetailsRes.ok) {
        const repoDetails = await repoDetailsRes.json();
        
        const newRepo = new Repo({
          name: repoDetails.name,
          owner: repoDetails.owner.login,
          fullName: repoDetails.full_name,
          description: repoDetails.description || "",
          url: repoDetails.html_url,
          stars: repoDetails.stargazers_count,
          forks: repoDetails.forks_count,
          watchers: repoDetails.watchers_count,
          language: repoDetails.language || "",
          starredBy: [user.username],
          isPrivate: repoDetails.private
        });
        
        await newRepo.save();
      }
    } else {
      // Update existing repo record
      if (!existingRepo.starredBy.includes(user.username)) {
        existingRepo.starredBy.push(user.username);
        existingRepo.stars += 1;
        await existingRepo.save();
      }
    }
    
    res.status(200).json({ success: true, message: 'Repository starred successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const unstarRepo = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    
    // Unstar the repo on GitHub
    const response = await fetch(`https://api.github.com/user/starred/${owner}/${repo}`, {
      method: 'DELETE',
      headers: {
        authorization: `token ${process.env.GITHUB_API_KEY}`,
      },
    });
    
    if (response.status !== 204) {
      return res.status(response.status).json({ 
        error: `GitHub API Error: ${response.statusText}` 
      });
    }
    
    // Update our database
    const user = await User.findById(req.user._id.toString());
    const repoFullName = `${owner}/${repo}`;
    
    // Remove repo from user's starred repos
    const starredIndex = user.starredRepos.indexOf(repoFullName);
    if (starredIndex !== -1) {
      user.starredRepos.splice(starredIndex, 1);
      await user.save();
    }
    
    // Update repo document
    const existingRepo = await Repo.findOne({ fullName: repoFullName });
    if (existingRepo) {
      const starrerIndex = existingRepo.starredBy.indexOf(user.username);
      if (starrerIndex !== -1) {
        existingRepo.starredBy.splice(starrerIndex, 1);
        existingRepo.stars = Math.max(0, existingRepo.stars - 1);
        await existingRepo.save();
      }
    }
    
    res.status(200).json({ success: true, message: 'Repository unstarred successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const forkRepo = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    
    // Fork the repo on GitHub
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/forks`, {
      method: 'POST',
      headers: {
        authorization: `token ${process.env.GITHUB_API_KEY}`,
      },
    });
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `GitHub API Error: ${response.statusText}` 
      });
    }
    
    const forkData = await response.json();
    
    // Update repo document if it exists
    const repoFullName = `${owner}/${repo}`;
    const existingRepo = await Repo.findOne({ fullName: repoFullName });
    
    if (existingRepo) {
      existingRepo.forks += 1;
      if (!existingRepo.forkedBy.includes(req.user.username)) {
        existingRepo.forkedBy.push(req.user.username);
      }
      await existingRepo.save();
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Repository forked successfully',
      fork: forkData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStargazers = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { page = 1, per_page = 30 } = req.query;
    
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/stargazers?page=${page}&per_page=${per_page}`,
      {
        headers: {
          authorization: `token ${process.env.GITHUB_API_KEY}`,
          'Accept': 'application/vnd.github.v3.star+json'
        },
      }
    );
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `GitHub API Error: ${response.statusText}` 
      });
    }
    
    const stargazers = await response.json();
    
    res.status(200).json({ stargazers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getForkers = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { page = 1, per_page = 30 } = req.query;
    
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/forks?page=${page}&per_page=${per_page}`,
      {
        headers: {
          authorization: `token ${process.env.GITHUB_API_KEY}`,
        },
      }
    );
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `GitHub API Error: ${response.statusText}` 
      });
    }
    
    const forks = await response.json();
    
    res.status(200).json({ forks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRepoContributors = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contributors`,
      {
        headers: {
          authorization: `token ${process.env.GITHUB_API_KEY}`,
        },
      }
    );
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `GitHub API Error: ${response.statusText}` 
      });
    }
    
    const contributors = await response.json();
    
    res.status(200).json({ contributors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRepoLanguages = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/languages`,
      {
        headers: {
          authorization: `token ${process.env.GITHUB_API_KEY}`,
        },
      }
    );
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `GitHub API Error: ${response.statusText}` 
      });
    }
    
    const languages = await response.json();
    
    res.status(200).json({ languages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRepoIssues = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { state = 'open', page = 1, per_page = 30 } = req.query;
    
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues?state=${state}&page=${page}&per_page=${per_page}`,
      {
        headers: {
          authorization: `token ${process.env.GITHUB_API_KEY}`,
        },
      }
    );
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `GitHub API Error: ${response.statusText}` 
      });
    }
    
    const issues = await response.json();
    
    res.status(200).json({ issues });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRepoPullRequests = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { state = 'open', page = 1, per_page = 30 } = req.query;
    
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls?state=${state}&page=${page}&per_page=${per_page}`,
      {
        headers: {
          authorization: `token ${process.env.GITHUB_API_KEY}`,
        },
      }
    );
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `GitHub API Error: ${response.statusText}` 
      });
    }
    
    const pullRequests = await response.json();
    
    res.status(200).json({ pullRequests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};