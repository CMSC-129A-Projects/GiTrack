import { useState, useEffect } from 'react';

import BoardsService from 'services/BoardsService';

const useBoard = ({ boardId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [board, setBoard] = useState([]);
  const [callCount, setCallCount] = useState(0);

  useEffect(() => {
    if (!boardId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    BoardsService.retrieve({ boardId }).then(({ data }) => {
      if (isMounted) {
        setBoard(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [boardId, callCount]);

  return {
    isLoading,
    board,
    refresh: () => {
      setCallCount(callCount + 1);
    },
  };
};

export default useBoard;
