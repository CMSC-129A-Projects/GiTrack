import { useState, useEffect } from 'react';

import BoardsService from 'services/BoardsService';

const useBoardRepos = ({ boardId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [boardRepos, setBoardRepos] = useState([]);
  const [callCount, setCallCount] = useState(0);

  useEffect(() => {
    if (!boardId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    BoardsService.retrieveRepos({ boardId })
      .then(({ data }) => {
        if (isMounted) {
          setBoardRepos(data);
          setIsLoading(false);
        }
      })
      .catch(({ response }) => {
        if (isMounted) {
          setBoardRepos(response.data);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [boardId, callCount]);

  return {
    isLoading,
    boardRepos,
    refresh: () => {
      setCallCount(callCount + 1);
    },
  };
};

export default useBoardRepos;
