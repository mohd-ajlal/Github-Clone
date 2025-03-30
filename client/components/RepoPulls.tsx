import React, { useEffect, useState } from 'react';

interface RepoPullsProps {
  owner: string;
  repo: string;
}

const RepoPulls: React.FC<RepoPullsProps> = ({ owner, repo }) => {
  const [pulls, setPulls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPulls = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/repos/${owner}/${repo}/pulls`);
        if (!response.ok) {
          throw new Error('Failed to fetch pull requests');
        }
        const data = await response.json();
        setPulls(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPulls();
  }, [owner, repo]);

  if (loading) {
    return <div>Loading pull requests...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Pull Requests</h2>
      {pulls.length === 0 ? (
        <p>No pull requests found.</p>
      ) : (
        <ul>
          {pulls.map((pull) => (
            <li key={pull.id}>
              <a href={pull.html_url} target="_blank" rel="noopener noreferrer">
                {pull.title}
              </a>
              <p>Created by: {pull.user.login}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RepoPulls;