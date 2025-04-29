// controllers/search.controller.js

import dotenv from 'dotenv';
dotenv.config();

const GITHUB_API_KEY = process.env.GITHUB_API_KEY;

// Utility function to fetch from GitHub API
const fetchGitHubAPI = async (url) => {
  const response = await fetch(url, {
    headers: {
      authorization: `token ${GITHUB_API_KEY}`,
      Accept: 'application/vnd.github+json',
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API Error: ${response.statusText}`);
  }

  return response.json();
};

export const searchRepos = async (req, res) => {
  try {
    const { q, sort = 'stars', order = 'desc', page = 1, per_page = 30, language } = req.query;

    if (!q) return res.status(400).json({ error: 'Search query is required' });

    let query = q;
    if (language) query += `+language:${language}`;

    const url = `https://api.github.com/search/repositories?q=${query}&sort=${sort}&order=${order}&page=${page}&per_page=${per_page}`;
    const data = await fetchGitHubAPI(url);

    res.status(200).json({
      total_count: data.total_count,
      incomplete_results: data.incomplete_results,
      repos: data.items,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q, sort = 'followers', order = 'desc', page = 1, per_page = 30, type = 'user' } = req.query;

    if (!q) return res.status(400).json({ error: 'Search query is required' });

    const query = `${q}+type:${type}`;
    const url = `https://api.github.com/search/users?q=${query}&sort=${sort}&order=${order}&page=${page}&per_page=${per_page}`;
    const data = await fetchGitHubAPI(url);

    const users = await Promise.all(
      data.items.map(async (user) => {
        const userDetail = await fetchGitHubAPI(user.url);
        return {
          login: userDetail.login,
          name: userDetail.name,
          avatar_url: userDetail.avatar_url,
          bio: userDetail.bio,
          followers: userDetail.followers,
          following: userDetail.following,
          public_repos: userDetail.public_repos,
          location: userDetail.location,
          company: userDetail.company,
          html_url: userDetail.html_url,
        };
      })
    );

    res.status(200).json({ total_count: data.total_count, users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const searchCode = async (req, res) => {
  try {
    const { q, sort = 'indexed', order = 'desc', page = 1, per_page = 30 } = req.query;

    if (!q) return res.status(400).json({ error: 'Search query is required' });

    const query = encodeURIComponent(q);
    const url = `https://api.github.com/search/code?q=${query}&sort=${sort}&order=${order}&page=${page}&per_page=${per_page}`;
    const data = await fetchGitHubAPI(url);

    res.status(200).json({ total_count: data.total_count, code: data.items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const searchIssues = async (req, res) => {
  try {
    const { q, sort = 'updated', order = 'desc', page = 1, per_page = 30, state } = req.query;

    if (!q) return res.status(400).json({ error: 'Search query is required' });

    let query = q;
    if (state) query += `+state:${state}`;

    const url = `https://api.github.com/search/issues?q=${query}&sort=${sort}&order=${order}&page=${page}&per_page=${per_page}`;
    const data = await fetchGitHubAPI(url);

    res.status(200).json({ total_count: data.total_count, issues: data.items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const searchAdvanced = async (req, res) => {
  try {
    const { query, type = 'repositories', sort = 'stars', order = 'desc', page = 1, per_page = 30 } = req.body;

    if (!query) return res.status(400).json({ error: 'Search query is required' });

    const validTypes = ['repositories', 'users', 'code', 'issues'];
    if (!validTypes.includes(type)) return res.status(400).json({ error: 'Invalid search type' });

    const url = `https://api.github.com/search/${type}?q=${encodeURIComponent(query)}&sort=${sort}&order=${order}&page=${page}&per_page=${per_page}`;
    const data = await fetchGitHubAPI(url);

    res.status(200).json({ total_count: data.total_count, results: data.items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
