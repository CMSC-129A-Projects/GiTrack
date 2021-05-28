import { useState, useEffect } from 'react';

import GithubService from 'services/GithubService';

const useCommits = ({ repoId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [commits, setCommits] = useState([]);
  const [callCount, setCallCount] = useState(0);

  useEffect(() => {
    if (!repoId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    GithubService.commits({ repoId }).then(
      ({ data: { commits: retrievedCommits } }) => {
        if (isMounted) {
          setCommits(retrievedCommits.slice(0, 3));
          setIsLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
    };
  }, [repoId, callCount]);

  return {
    isLoading,
    commits,
    refresh: () => {
      setCallCount(callCount + 1);
    },
  };
};

export default useCommits;
