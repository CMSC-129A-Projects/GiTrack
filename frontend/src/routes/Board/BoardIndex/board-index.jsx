/** @jsxImportSource @emotion/react */

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

import useBoard from 'hooks/useBoard';
import useBoardTasks from 'hooks/useBoardTasks';
import useBoardRepos from 'hooks/useBoardRepos';
import useBoardMembers from 'hooks/useBoardMembers';
import useGithubBranches from 'hooks/useGithubBranches';

import Spinner from 'components/Spinner';
import Card from 'components/Card';
import Column from 'components/Column';
import Button from 'components/Button';
import buttonVariants from 'components/Button/constants';
import Icon from 'components/Icon';
import Search from 'components/Search';
import Dropdown from 'components/Dropdown';

import useOnClickOutside from 'hooks/useOnClickOutside';

import TaskCard from 'widgets/TaskCard';
import BoardRepositories from 'widgets/BoardRepositories';
import BoardMembers from 'widgets/BoardMembers';
import AddTaskModal from 'widgets/AddTaskModal';
import ViewTaskModal from 'widgets/ViewTaskModal';
import AddRepoModal from 'widgets/AddRepoModal';
import AddDeveloperModal from 'widgets/AddDeveloperModal';
import SigninGithubModal from 'widgets/SigninGithubModal';
import ViewMemberModal from 'widgets/ViewMemberModal';
import ViewRepoModal from 'widgets/ViewRepoModal';
import RemoveBoardModal from 'widgets/RemoveConfirmationModal';

import BoardService from 'services/BoardService';

// Style
import * as style from './board-index-styles';

export default function BoardIndex({ refreshBoards }) {
  const { boardId } = useParams();
  const settingsRef = useRef();

  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [filters, setFilters] = useState({
    assignee: null,
  });

  const [isAddTaskModalOpened, setIsAddTaskModalOpened] = useState(false);
  const [isAddRepoModalOpened, setIsAddRepoModalOpened] = useState(false);
  const [isAddDeveloperModalOpened, setIsAddDeveloperModalOpened] = useState(false);
  const [isSigninGithubModalOpened, setIsSigninGithubModalOpened] = useState(false);
  const [isRemoveBoardModalOpened, setIsRemoveBoardModalOpened] = useState(false);
  const [repoIds, setRepoIds] = useState([]);

  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);

  useOnClickOutside(settingsRef, () => setIsSettingsDropdownOpen(false));

  const [taskToView, setTaskToView] = useState(null);
  const [memberToView, setMemberToView] = useState(null);
  const [repoToView, setRepoToView] = useState(null);

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

  const isLoading = isBoardLoading || isBoardReposLoading || isBoardMembersLoading;

  useEffect(() => {
    if (!isLoading) {
      setFilteredTasks(boardTasks?.tasks);
    }
  }, [boardTasks, isLoading]);

  useEffect(() => {
    if (boardTasks?.tasks?.length > 0) {
      let filtered = boardTasks?.tasks.filter((t) =>
        t.title.toLowerCase().match(searchString.toLowerCase())
      );

      if (filters.assignee != null) {
        filtered = filtered.filter((t) =>
          t.assignee_ids.includes(filters.assignee?.value)
        );
      }

      setFilteredTasks(filtered);
    }
  }, [boardTasks, searchString, filters]);

  if (isLoading) {
    return <Spinner />;
  }

  const notStartedTasks = filteredTasks?.filter((task) => task.column_id === 0);
  const inProgressTasks = filteredTasks?.filter((task) => task.column_id === 1);
  const mergedTasks = filteredTasks?.filter((task) => task.column_id === 2);

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
      <RemoveBoardModal
        isOpen={isRemoveBoardModalOpened}
        handleClose={() => setIsRemoveBoardModalOpened(false)}
        handleSuccess={() =>
          BoardService.removeBoard({ boardId }).then(() => {
            refreshBoards();
            setIsRemoveBoardModalOpened(false);
          })
        }
        message="Are you sure you want to remove this board?"
      />
      {memberToView && (
        <ViewMemberModal
          isOpen={memberToView !== null}
          handleClose={() => setMemberToView(null)}
          member={memberToView}
          boardId={boardId}
          refreshBoardMembers={refreshBoardMembers}
        />
      )}
      {repoToView && (
        <ViewRepoModal
          isOpen={repoToView !== null}
          handleClose={() => setRepoToView(null)}
          repo={repoToView}
          boardId={boardId}
          refreshBoardRepos={refreshBoardRepos}
        />
      )}
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
        <div css={style.boardIndex_filterOptions}>
          <Search
            css={style.boardIndex_search}
            onChange={(e) => setSearchString(e.target.value)}
          />
          <div css={style.boardIndex_filter}>
            <p css={style.boardIndex_filter_label}>Filter by:</p>
            <Dropdown
              css={style.boardIndex_filter_dropdown}
              placeholder="Member"
              options={boardMembers.map((member) => ({
                label: member.username,
                value: member.id,
              }))}
              onChange={(option) => setFilters({ assignee: option })}
              isClearable
            />
          </div>
        </div>
        <div css={style.boardIndex_columns}>
          <Column
            isLoading={isBoardTasksLoading}
            title="📋 Not Started"
            count={notStartedTasks?.length}
          >
            {notStartedTasks?.map((task) => (
              <TaskCard
                members={boardMembers}
                title={task.title}
                assignees={task.assignee_ids}
                onClick={() => setTaskToView(task)}
                targetDate={task.target_date}
              />
            ))}
          </Column>
          <Column
            isLoading={isBoardTasksLoading}
            title="🔨 In Progress"
            count={inProgressTasks?.length}
          >
            {inProgressTasks?.map((task) => (
              <TaskCard
                members={boardMembers}
                title={task.title}
                assignees={task.assignee_ids}
                onClick={() => setTaskToView(task)}
                targetDate={task.target_date}
                tag={task.branch_name}
              />
            ))}
          </Column>
          <Column
            isLoading={isBoardTasksLoading}
            title="🎉 Merged"
            count={mergedTasks?.length}
          >
            {mergedTasks?.map((task) => (
              <TaskCard
                members={boardMembers}
                title={task.title}
                assignees={task.assignee_ids}
                onClick={() => setTaskToView(task)}
                targetDate={task.target_date}
                tag={task.branch_name}
              />
            ))}
          </Column>
          <div css={style.boardIndex_sidePanel}>
            <p css={style.boardIndex_text}>Repositories</p>
            <BoardRepositories
              repos={boardRepos}
              setIsAddRepoModalOpened={setIsAddRepoModalOpened}
              setIsSigninGithubModalOpened={setIsSigninGithubModalOpened}
              setRepoToView={setRepoToView}
            />
            <p css={style.boardIndex_text}>Members</p>
            <BoardMembers
              members={boardMembers}
              setIsAddDeveloperModalOpened={setIsAddDeveloperModalOpened}
              setMemberToView={setMemberToView}
            />
            <button
              css={style.boardIndex_settingsButton}
              onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)}
            >
              <p css={style.boardIndex_text}>Settings</p>
              <Icon icon="settings" css={style.boardIndex_settings} />
            </button>
            {isSettingsDropdownOpen && (
              <Card css={style.boardIndex_settingsDropdown} ref={settingsRef}>
                <button
                  css={style.boardIndex_settingsDropdown_button}
                  onClick={() => setIsRemoveBoardModalOpened(true)}
                >
                  <Icon
                    icon="delete"
                    css={style.boardIndex_settingsDropdown_button_icon}
                  />
                  Delete Board
                </button>
              </Card>
            )}
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
