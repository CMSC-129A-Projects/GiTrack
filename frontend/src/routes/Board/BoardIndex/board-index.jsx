/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import useBoard from 'hooks/useBoard';
import useBoardTasks from 'hooks/useBoardTasks';
import useBoardRepos from 'hooks/useBoardRepos';
import useGithubBranches from 'hooks/useGithubBranches';

import Spinner from 'components/Spinner';
import Column from 'components/Column';
import Button from 'components/Button';
import buttonVariants from 'components/Button/constants';
import Icon from 'components/Icon';

import TaskCard from 'widgets/TaskCard';
import BoardRepositories from 'widgets/BoardRepositories';
import AddTaskModal from 'widgets/AddTaskModal';
import ViewTaskModal from 'widgets/ViewTaskModal';
import AddRepoModal from 'widgets/AddRepoModal';
import AddDeveloperModal from 'widgets/AddDeveloperModal';
import SigninGithubModal from 'widgets/SigninGithubModal';

import placeholder from 'assets/images/user-image.svg';

// Style
import * as style from './board-index-styles';

export default function BoardIndex() {
  const { boardId } = useParams();

  const [isAddTaskModalOpened, setIsAddTaskModalOpened] = useState(false);
  const [isAddRepoModalOpened, setIsAddRepoModalOpened] = useState(false);
  const [isAddDeveloperModalOpened, setIsAddDeveloperModalOpened] = useState(false);
  const [isSigninGithubModalOpened, setIsSigninGithubModalOpened] = useState(false);
  const [repoIds, setRepoIds] = useState([]);

  const [taskToView, setTaskToView] = useState(null);

  const { isLoading: isBoardLoading, board } = useBoard({ boardId });
  const {
    isLoading: isBoardTasksLoading,
    boardTasks,
    refresh: refreshBoardTasks,
  } = useBoardTasks({ boardId });

  const {
    isLoading: isBoardReposLoading,
    boardRepos,
    refresh: refreshBoardRepos,
  } = useBoardRepos({ boardId });

  const { githubBranches } = useGithubBranches({
    repoIds,
  });

  useEffect(() => {
    setRepoIds(boardRepos?.repos?.map((repo) => repo.id));
  }, [boardRepos]);

  if (isBoardLoading || isBoardTasksLoading || isBoardReposLoading) {
    return <Spinner />;
  }

  const notStartedTasks = boardTasks.tasks.filter((task) => task.column_id === 0);
  const inProgressTasks = boardTasks.tasks.filter((task) => task.column_id === 1);
  const mergedTasks = boardTasks.tasks.filter((task) => task.column_id === 2);

  return (
    <>
      <AddTaskModal
        boardId={boardId}
        isOpen={isAddTaskModalOpened}
        handleClose={() => setIsAddTaskModalOpened(false)}
        refreshBoardTasks={refreshBoardTasks}
      />
      <AddRepoModal
        boardId={boardId}
        isOpen={isAddRepoModalOpened}
        handleClose={() => setIsAddRepoModalOpened(false)}
        refreshBoardRepos={refreshBoardRepos}
      />
      <AddDeveloperModal
        isOpen={isAddDeveloperModalOpened}
        handleClose={() => setIsAddDeveloperModalOpened(false)}
      />
      <SigninGithubModal
        isOpen={isSigninGithubModalOpened}
        handleClose={() => setIsSigninGithubModalOpened(false)}
      />
      {taskToView && (
        <ViewTaskModal
          task={taskToView}
          isOpen={taskToView !== null}
          handleClose={() => {
            setTaskToView(null);
            refreshBoardTasks();
          }}
          githubBranches={githubBranches}
        />
      )}
      <div css={style.boardIndex}>
        <div css={style.boardIndex_header}>
          <p css={style.boardIndex_header_boardName}>Board Name</p>
          <h2 css={style.boardIndex_header_name}>{board.title}</h2>
        </div>
        <div css={style.boardIndex_columns}>
          <Column title="Not Started" count={notStartedTasks?.length}>
            {notStartedTasks.map((task) => (
              <TaskCard title={task.title} onClick={() => setTaskToView(task)} />
            ))}
          </Column>
          <Column title="In Progress" count={inProgressTasks?.length}>
            {inProgressTasks.map((task) => (
              <TaskCard title={task.title} onClick={() => setTaskToView(task)} />
            ))}
          </Column>
          <Column title="Merged" count={mergedTasks?.length}>
            {mergedTasks.map((task) => (
              <TaskCard title={task.title} onClick={() => setTaskToView(task)} />
            ))}
          </Column>
          <div css={style.boardIndex_sidePanel}>
            <p css={style.boardIndex_text}>Repositories</p>
            <div css={style.boardIndex_iconRow}>
              <BoardRepositories
                boardRepos={boardRepos}
                setIsAddRepoModalOpened={setIsAddRepoModalOpened}
                setIsSigninGithubModalOpened={setIsSigninGithubModalOpened}
              />
            </div>
            <p css={style.boardIndex_text}>Members</p>
            <div css={style.boardIndex_iconRow}>
              <div css={style.boardIndex_imageContainer}>
                <img src={placeholder} alt="user1" css={style.boardIndex_image} />
              </div>
              <div css={style.boardIndex_imageContainer}>
                <img src={placeholder} alt="user2" css={style.boardIndex_image} />
              </div>
              <div css={style.boardIndex_imageContainer}>
                <img src={placeholder} alt="user3" css={style.boardIndex_image} />
              </div>
              <Icon
                icon="add"
                onClick={() => setIsAddDeveloperModalOpened(true)}
                onKeyDown={() => setIsAddDeveloperModalOpened(true)}
                css={style.boardIndex_icon__clickable}
              />
            </div>
          </div>
        </div>
        <Button
          onClick={() => setIsAddTaskModalOpened(true)}
          variant={buttonVariants.XLARGE.PRIMARY}
          icon="add"
          css={style.boardIndex_button}
        >
          Create Task
        </Button>
      </div>
    </>
  );
}
