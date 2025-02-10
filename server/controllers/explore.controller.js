import dotenv from "dotenv";
dotenv.config();


import User from "../models/user.model.js";

export const explorePopularRepos = async (req, res) => {
  const { language } = req.params;
  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc&per_page=10`,
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
    
    const data = await response.json();
    res.status(200).json({ repos: data.items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const exploreTrendingRepos = async (req, res) => {
  try {
    const { since = 'daily', language = '' } = req.query;
    
    let query = `created:>${getDateQuery(since)}`;
    if (language) {
      query += `+language:${language}`;
    }
    
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=10`,
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
    
    const data = await response.json();
    res.status(200).json({ repos: data.items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const exploreTopUsers = async (req, res) => {
  try {
    const { language = '', location = '' } = req.query;
    
    let query = 'type:user';
    if (language) {
      query += `+language:${language}`;
    }
    if (location) {
      query += `+location:${location}`;
    }
    
    const response = await fetch(
      `https://api.github.com/search/users?q=${query}&sort=followers&order=desc&per_page=10`,
      {
        headers: {
          authorization: `token ${process.env.GITHUB_API_KEY}`,
        },
      }
    );


    console.log("Response:", response); // Log the response object


    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `GitHub API Error: ${response.statusText}` 
      });
    }
    
    const data = await response.json();
    
    // Get detailed info for each user
    const detailedUsers = await Promise.all(
      data.items.map(async (user) => {
        const userResponse = await fetch(user.url, {
          headers: {
            authorization: `token ${process.env.GITHUB_API_KEY}`,
          },
        });
        return userResponse.json();
      })
    );
    
    // Check which users are liked by current user
    if (req.isAuthenticated()) {
      const currentUser = await User.findById(req.user._id.toString());
      
      detailedUsers.forEach(user => {
        user.isLiked = currentUser.likedProfiles.includes(user.login);
      });
    }
    
    res.status(200).json({ users: detailedUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const exploreTopics = async (req, res) => {
  try {
    const response = await fetch(
      `https://api.github.com/search/topics?q=stars:>1000&sort=stars&order=desc&per_page=20`,
      {
        headers: {
          authorization: `token ${process.env.GITHUB_API_KEY}`,
          'Accept': 'application/vnd.github.mercy-preview+json'
        },
      }
    );
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `GitHub API Error: ${response.statusText}` 
      });
    }
    
    const data = await response.json();
    res.status(200).json({ topics: data.items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const exploreByTopic = async (req, res) => {
  try {
    const { topic } = req.params;
    
    const response = await fetch(
      `https://api.github.com/search/repositories?q=topic:${topic}&sort=stars&order=desc&per_page=10`,
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
    
    const data = await response.json();
    res.status(200).json({ repos: data.items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to get date string for trending queries
function getDateQuery(since) {
  const date = new Date();
  
  switch (since) {
    case 'daily':
      date.setDate(date.getDate() - 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() - 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() - 1);
      break;
    default:
      date.setDate(date.getDate() - 1);
  }
  
  return date.toISOString().split('T')[0];
}