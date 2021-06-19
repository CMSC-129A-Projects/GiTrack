import { useState, useEffect } from 'react';

import GithubService from 'services/GithubService';

const useCommits = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [commits, setCommits] = useState([]);
  const [branchName, setBranchName] = useState(null);
  const [repoId, setRepoId] = useState(null);
  const [callCount, setCallCount] = useState(0);

  useEffect(() => {
    if (!repoId || !branchName) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    GithubService.commits({ repoId, params: { branch_name: branchName } })
      .then(({ data: { commits: retrievedCommits } }) => {
        if (isMounted) {
          setCommits(retrievedCommits.slice(0, 3));
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCommits([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [repoId, branchName, callCount]);

  return {
    isLoading,
    commits,
    refresh: ({ newRepoId, newBranchName }) => {
      setCallCount(callCount + 1);

      if (newRepoId) {
        setRepoId(newRepoId);
      }

      if (newBranchName) {
        setBranchName(newBranchName);
      }
    },
  };
};

export default useCommits;
