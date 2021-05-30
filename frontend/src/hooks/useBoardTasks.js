import { useState, useEffect } from 'react';

import BoardService from 'services/BoardService';

const useBoardTasks = ({ boardId }) => {
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
    BoardService.retrieveTasks({ boardId }).then(({ data }) => {
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

export default useBoardTasks;
