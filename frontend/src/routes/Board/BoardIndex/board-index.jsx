/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import useBoard from 'hooks/useBoard';
import useBoardTasks from 'hooks/useBoardTasks';
import useBoardRepos from 'hooks/useBoardRepos';
import useBoardMembers from 'hooks/useBoardMembers';
import useGithubBranches from 'hooks/useGithubBranches';

import Spinner from 'components/Spinner';
import Column from 'components/Column';
import Button from 'components/Button';
import buttonVariants from 'components/Button/constants';
import Icon from 'components/Icon';
import UserImage from 'components/UserImage';

import TaskCard from 'widgets/TaskCard';
import BoardRepositories from 'widgets/BoardRepositories';
import AddTaskModal from 'widgets/AddTaskModal';
import ViewTaskModal from 'widgets/ViewTaskModal';
import AddRepoModal from 'widgets/AddRepoModal';
import AddDeveloperModal from 'widgets/AddDeveloperModal';
import SigninGithubModal from 'widgets/SigninGithubModal';
import ViewMemberModal from 'widgets/ViewMemberModal';

// Style
import * as style from './board-index-styles';

export default function BoardIndex() {
  const { boardId } = useParams();

  const [isAddTaskModalOpened, setIsAddTaskModalOpened] = useState(false);
  const [isAddRepoModalOpened, setIsAddRepoModalOpened] = useState(false);
  const [isAddDeveloperModalOpened, setIsAddDeveloperModalOpened] = useState(false);
  const [isSigninGithubModalOpened, setIsSigninGithubModalOpened] = useState(false);
  const [isViewMemberModalOpened, setIsViewMemberModalOpened] = useState(false);
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

  const {
    isLoading: isBoardMembersLoading,
    boardMembers,
    refresh: refreshBoardMembers,
  } = useBoardMembers({ boardId });

  const { githubBranches } = useGithubBranches({
    repoIds,
  });

  useEffect(() => {
    setRepoIds(boardRepos?.repos?.map((repo) => repo.id));
  }, [boardRepos]);

  if (isBoardLoading || isBoardReposLoading || isBoardMembersLoading) {
    return <Spinner />;
  }

  const notStartedTasks = boardTasks?.tasks.filter((task) => task.column_id === 0);
  const inProgressTasks = boardTasks?.tasks.filter((task) => task.column_id === 1);
  const mergedTasks = boardTasks?.tasks.filter((task) => task.column_id === 2);

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
        boardId={boardId}
        refreshBoardMembers={refreshBoardMembers}
        isOpen={isAddDeveloperModalOpened}
        handleClose={() => setIsAddDeveloperModalOpened(false)}
      />
      <SigninGithubModal
        isOpen={isSigninGithubModalOpened}
        handleClose={() => setIsSigninGithubModalOpened(false)}
      />
      <ViewMemberModal
        isOpen={isViewMemberModalOpened}
        handleClose={() => setIsViewMemberModalOpened(false)}
      />
      {taskToView && (
        <ViewTaskModal
          board={board}
          task={taskToView}
          members={boardMembers}
          refreshBoardTasks={refreshBoardTasks}
          isOpen={taskToView !== null}
          setTaskToView={setTaskToView}
          handleClose={() => setTaskToView(null)}
          githubBranches={githubBranches}
        />
      )}
      <div css={style.boardIndex}>
        <div css={style.boardIndex_header}>
          <p css={style.boardIndex_header_boardName}>Board Name</p>
          <h2 css={style.boardIndex_header_name}>{board.title}</h2>
        </div>
        <div css={style.boardIndex_columns}>
          <Column
            isLoading={isBoardTasksLoading}
            title="📋 Not Started"
            count={notStartedTasks?.length}
          >
            {notStartedTasks.map((task) => (
              <TaskCard
                members={boardMembers}
                title={task.title}
                assignees={task.assignee_ids}
                onClick={() => setTaskToView(task)}
              />
            ))}
          </Column>
          <Column
            isLoading={isBoardTasksLoading}
            title="🔨 In Progress"
            count={inProgressTasks?.length}
          >
            {inProgressTasks.map((task) => (
              <TaskCard
                members={boardMembers}
                title={task.title}
                assignees={task.assignee_ids}
                onClick={() => setTaskToView(task)}
              />
            ))}
          </Column>
          <Column
            isLoading={isBoardTasksLoading}
            title="🎉 Merged"
            count={mergedTasks?.length}
          >
            {mergedTasks.map((task) => (
              <TaskCard
                members={boardMembers}
                title={task.title}
                assignees={task.assignee_ids}
                onClick={() => setTaskToView(task)}
              />
            ))}
          </Column>
          <div css={style.boardIndex_sidePanel}>
            <p css={style.boardIndex_text}>Repositories</p>
            <div css={style.boardIndex_iconRow}>
              <button css={style.boardIndex_panelButton}>
                <BoardRepositories
                  boardRepos={boardRepos}
                  setIsAddRepoModalOpened={setIsAddRepoModalOpened}
                  setIsSigninGithubModalOpened={setIsSigninGithubModalOpened}
                  css={style.boardIndex_icon__clickable}
                />
              </button>
            </div>
            <p css={style.boardIndex_text}>Members</p>
            <div css={style.boardIndex_iconRow}>
              {boardMembers.map((member) => (
                <button
                  css={style.boardIndex_panelButton}
                  onClick={() => setIsViewMemberModalOpened(true)}
                >
                  <UserImage id={member.id} name={member.username} />
                </button>
              ))}
              <button
                css={style.boardIndex_panelButton}
                onClick={() => setIsAddDeveloperModalOpened(true)}
              >
                <Icon icon="add" css={style.boardIndex_icon__clickable} />
              </button>
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
