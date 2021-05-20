import { useState, useEffect } from 'react';

import BoardsService from 'services/BoardsService';

const useBoard = ({ boardId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [boardTasks, setBoardTasks] = useState([]);
  const [callCount, setCallCount] = useState(0);

  useEffect(() => {
    if (!boardId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    BoardsService.retrieveTasks({ boardId }).then(({ data }) => {
      if (isMounted) {
        setBoardTasks(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [boardId, callCount]);

  return {
    isLoading,
    boardTasks,
    refresh: () => {
      setCallCount(callCount + 1);
    },
  };
};

export default useBoard;
