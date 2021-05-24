import { useState, useEffect } from 'react';

import GithubService from 'services/GithubService';

const useGithubBranches = ({ repoIds }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [githubBranches, setGithubBranches] = useState([]);
  const [callCount, setCallCount] = useState(0);

  useEffect(() => {
    if (!repoIds) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const retrievePromises = [];
    repoIds.forEach((repoId) => {
      retrievePromises.push(GithubService.branches({ repoId }));
    });

    Promise.all(retrievePromises)
      .then((responses) => {
        setGithubBranches(responses.map((response) => response.data));
        setIsLoading(false);
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [repoIds?.length, callCount]);

  return {
    isLoading,
    githubBranches,
    refresh: () => {
      setCallCount(callCount + 1);
    },
  };
};

export default useGithubBranches;
