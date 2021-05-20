import { useState, useEffect } from 'react';

import BoardsService from 'services/BoardsService';

const useBoards = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [boards, setBoards] = useState([]);
  const [callCount, setCallCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    BoardsService.list().then(({ data: { boards: retrievedBoards } }) => {
      if (isMounted) {
        setBoards(retrievedBoards);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [callCount]);

  return {
    isLoading,
    boards,
    refresh: () => {
      setCallCount(callCount + 1);
    },
  };
};

export default useBoards;
