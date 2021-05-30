import { useState, useEffect } from 'react';

import BoardService from 'services/BoardService';

const useBoards = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [boards, setBoards] = useState([]);
  const [callCount, setCallCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    BoardService.list()
      .then(({ data: { boards: retrievedBoards } }) => {
        if (isMounted) {
          setBoards(retrievedBoards);
          setIsLoading(false);
        }
      })
      .catch((e) => console.log(e));

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
