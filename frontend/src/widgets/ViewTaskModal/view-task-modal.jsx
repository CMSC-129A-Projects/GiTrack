/** @jsxImportSource @emotion/react */

import { useState, useEffect } from 'react';

import TaskService from 'services/TaskService';
import useCommits from 'hooks/useCommits';

import RemoveConfirmationModal from 'widgets/RemoveConfirmationModal';

import Modal from 'components/Modal';
import Dropdown from 'components/Dropdown';
import buttonVariants from 'components/Button/constants';
import modalSizes from 'components/Modal/constants';
import Card from 'components/Card';
import Icon from 'components/Icon';

// Style
import * as style from './view-task-modal-styles';

export default function ViewTaskModal({
  board,
  task,
  members,
  refreshBoardTasks,
  isOpen,
  handleClose,
  githubBranches,
}) {
  const [isRemoveTaskModalOpened, setIsRemoveTaskModalOpened] = useState(false);
  const [selectedDevelopers, setSelectedDevelopers] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isPastDeadline, setIsPastDeadline] = useState(false);
  const [options, setOptions] = useState([]);

  const { isLoading: isCommitsLoading, commits } = useCommits({ repoId: task.repo_id });

  useEffect(() => {
    task.assignee_ids.forEach((id) => {
      const assignedDev = members.find((member) => member.id === id);

      if (assignedDev != null) {
        setSelectedDevelopers((assignees) => [
          ...assignees,
          {
            label: assignedDev.username,
            value: assignedDev.id,
          },
        ]);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedBranch && selectedBranch.name !== task.branch_name) {
      TaskService.connect({
        body: {
          repo_id: selectedBranch.repo_id,
          name: selectedBranch.name,
        },
        taskId: task.id,
      });
    }
  }, [selectedBranch]);

  useEffect(() => {
    const tempOptions =
      githubBranches?.[0]?.branches.map((branch) => ({
        ...branch,
        label: branch.name,
      })) ?? [];
    const currentBranch =
      tempOptions.map((option) => option.name).indexOf(task.branch_name) ?? 0;

    setOptions(tempOptions);
    setSelectedBranch(tempOptions[currentBranch]);
  }, [githubBranches]);

  const handleSuccess = () => {
    refreshBoardTasks();
    setIsRemoveTaskModalOpened(false);
    handleClose();
  };

  const handleCloseFn = () => {
    const data = {
      taskId: task.id,
      body: {
        board_id: board.id,
        assignee_ids: selectedDevelopers.map((dev) => dev.value),
      },
    };

    if (selectedDevelopers.length > 0 && task.assignee_ids.length === 0) {
      TaskService.assign(data).then(() => {
        handleSuccess();
      });
    } else if (hasChanges) {
      TaskService.updateAssignees(data).then(() => {
        handleSuccess();
      });
    } else {
      handleSuccess();
    }
  };

  const date = new Date(task.target_date);

  useEffect(() => {
    const dateNow = Date.now();

    if (dateNow > date.getTime() && date.getTime() > 0) {
      setIsPastDeadline(true);
    }
  }, []);

  return (
    <>
      {isRemoveTaskModalOpened && (
        <RemoveConfirmationModal
          isOpen={isRemoveTaskModalOpened}
          handleSuccess={() =>
            TaskService.remove({ taskId: task.id }).then(handleSuccess)
          }
          handleClose={() => setIsRemoveTaskModalOpened(false)}
          message="Are you sure you want to remove this task?"
        />
      )}
      <Modal
        size={modalSizes.LG}
        title="View Task"
        icon="create"
        isOpen={isOpen}
        isLoading={isCommitsLoading}
        handleClose={handleCloseFn}
        actions={[
          {
            name: 'Remove',
            onClick: () => setIsRemoveTaskModalOpened(true),
            variant: buttonVariants.SMALL.PRIMARY,
          },
          {
            name: 'Close',
            onClick: handleCloseFn,
            variant: buttonVariants.SMALL.SECONDARY,
          },
        ]}
      >
        <p css={style.viewTaskModal_title}>{task.title}</p>
        <div css={style.viewTaskModal_body}>
          <div>
            {task.description !== '' && (
              <>
                <p css={style.viewTaskModal_bodyTitle}>Description</p>
                <p css={style.viewTaskModal_bodyText}>
                  <span dangerouslySetInnerHTML={{ __html: task.description }} />
                </p>
              </>
            )}
            {date.getTime() > 0 && (
              <>
                <p css={style.viewTaskModal_bodyTitle}>Target Date</p>
                <p css={style.viewTaskModal_bodyText}>
                  {date.toDateString()}
                  {isPastDeadline && (
                    <Icon icon="warning" css={style.viewTaskModal_warningIcon} />
                  )}
                </p>
              </>
            )}
            <p css={style.viewTaskModal_bodyTitle}>Progress</p>
            {commits.length > 0 ? (
              <>
                {commits.map(({ hash, message }) => (
                  <div css={style.viewTaskModal_progress}>
                    <p css={style.viewTaskModal_progressTime}>{hash.slice(0, 8)}</p>
                    <p css={style.viewTaskModal_progressText}>{message}</p>
                  </div>
                ))}
              </>
            ) : (
              <p css={style.viewTaskModal_bodyText}>No branch added yet</p>
            )}
          </div>
          <Card css={style.viewTaskModal_optionsCard}>
            <Dropdown
              css={style.viewTaskModal_input}
              value={selectedDevelopers}
              label="Assignees"
              options={members.map((member) => ({
                label: member.username,
                value: member.id,
              }))}
              onChange={(option) => {
                setSelectedDevelopers(option);
                setHasChanges(true);
              }}
              isMulti
              isClearable={false}
            />
            <Dropdown
              css={style.viewTaskModal_input___repository}
              label="Branch"
              options={options}
              placeholder="Repository"
            />
            <Dropdown
              css={style.viewTaskModal_input}
              value={selectedBranch}
              options={options}
              onChange={(option) => {
                setSelectedBranch(option);
              }}
            />
          </Card>
        </div>
      </Modal>
    </>
  );
}
