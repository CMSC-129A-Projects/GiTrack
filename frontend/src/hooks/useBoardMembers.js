import { useState, useEffect } from 'react';

import BoardService from 'services/BoardService';

const useBoardMembers = ({ boardId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [boardMembers, setBoardMembers] = useState([]);
  const [callCount, setCallCount] = useState(0);

  useEffect(() => {
    if (!boardId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    BoardService.retrieveMembers({ boardId }).then(({ data: { members } }) => {
      if (isMounted) {
        setBoardMembers(members);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [boardId, callCount]);

  return {
    isLoading,
    boardMembers,
    refresh: () => {
      setCallCount(callCount + 1);
    },
  };
};

export default useBoardMembers;
