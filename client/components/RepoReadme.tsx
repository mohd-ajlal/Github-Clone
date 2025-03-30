import React, { useEffect, useState } from 'react';

interface RepoReadmeProps {
  owner: string;
  repo: string;
  readme: string | null;
}

const RepoReadme: React.FC<RepoReadmeProps> = ({ owner, repo, readme }) => {
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    if (readme) {
      setContent(readme);
    } else {
      fetchReadme();
    }
  }, [owner, repo, readme]);

  const fetchReadme = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/repos/${owner}/${repo}/readme`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch README');
      }

      const data = await response.json();
      setContent(atob(data.content)); // Decode base64 content
    } catch (error) {
      console.error('Error fetching README:', error);
      setContent('Failed to load README content.');
    }
  };

  return (
    <div className="prose">
      {content ? (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <p>Loading README...</p>
      )}
    </div>
  );
};

export default RepoReadme;