/** @jsxImportSource @emotion/react */

import { useState, useEffect } from 'react';

import TasksService from 'services/TasksService';

import RemoveTaskModal from 'widgets/RemoveTaskModal';

import Modal from 'components/Modal';
import Dropdown from 'components/Dropdown';
import buttonVariants from 'components/Button/constants';
import modalSizes from 'components/Modal/constants';
import Card from 'components/Card';

// Style
import * as style from './view-task-modal-styles';

export default function ViewTaskModal({ task, isOpen, handleClose, githubBranches }) {
  const [isRemoveTaskModalOpened, setIsRemoveTaskModalOpened] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (selectedBranch && selectedBranch.name !== task.branch_name) {
      TasksService.connect({
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

  return (
    <>
      {isRemoveTaskModalOpened && (
        <RemoveTaskModal
          isOpen={isRemoveTaskModalOpened}
          handleClose={(() => setIsRemoveTaskModalOpened(false), handleClose)}
          task={task}
        />
      )}
      <Modal
        size={modalSizes.LG}
        title="View Task"
        icon="create"
        isOpen={isOpen}
        handleClose={handleClose}
        actions={[
          {
            name: 'Remove',
            onClick: () => setIsRemoveTaskModalOpened(true),
            variant: buttonVariants.SMALL.PRIMARY,
          },
          {
            name: 'Cancel',
            onClick: handleClose,
            variant: buttonVariants.SMALL.SECONDARY,
          },
        ]}
      >
        <p css={style.viewTaskModal_title}>{task.title}</p>
        <div css={style.viewTaskModal_body}>
          <div>
            <p css={style.viewTaskModal_bodyTitle}>Description</p>
            <p css={style.viewTaskModal_bodyText}>
              <span dangerouslySetInnerHTML={{ __html: task.description }} />
            </p>
            <p css={style.viewTaskModal_bodyTitle}>Progress</p>
            <p css={style.viewTaskModal_bodyText}>No branch added yet</p>
            {/* <div css={style.viewTaskModal_progress}>
              <p css={style.viewTaskModal_progressTime}>2 hours ago</p>
              <p css={style.viewTaskModal_progressText}>added tests</p>
            </div>
            <div css={style.viewTaskModal_progress}>
              <p css={style.viewTaskModal_progressTime}>15 hours ago</p>
              <p css={style.viewTaskModal_progressText}>added working component</p>
            </div>
            <div css={style.viewTaskModal_progress}>
              <p css={style.viewTaskModal_progressTime}>3 days ago</p>
              <p css={style.viewTaskModal_progressText}>added initial setup</p>
            </div> */}
          </div>
          <Card css={style.viewTaskModal_optionsCard}>
            <Dropdown css={style.viewTaskModal_input} label="Assignee" />
            <Dropdown
              css={style.viewTaskModal_input}
              label="Branch"
              value={selectedBranch}
              options={options}
              onChange={(option) => setSelectedBranch(option)}
            />
          </Card>
        </div>
      </Modal>
    </>
  );
}
