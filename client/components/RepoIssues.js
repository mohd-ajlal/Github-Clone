import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const RepoIssues = ({ owner, repo }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/repos/issues/${owner}/${repo}`,
          { credentials: 'include' }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch issues');
        }

        const data = await response.json();
        setIssues(data);
      } catch (error) {
        console.error('Error fetching issues:', error);
        toast({
          title: 'Error',
          description: 'Failed to load issues. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [owner, repo, toast]);

  if (loading) {
    return <div>Loading issues...</div>;
  }

  if (issues.length === 0) {
    return <div>No issues found for this repository.</div>;
  }

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Issues</h2>
      <ul>
        {issues.map(issue => (
          <li key={issue.id} className="border-b py-2">
            <a href={issue.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {issue.title}
            </a>
            <p className="text-gray-500">{issue.state}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RepoIssues;