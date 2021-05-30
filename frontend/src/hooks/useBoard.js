import { useState, useEffect } from 'react';

import BoardService from 'services/BoardService';

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
    BoardService.retrieve({ boardId }).then(({ data }) => {
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
