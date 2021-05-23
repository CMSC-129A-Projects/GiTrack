/** @jsxImportSource @emotion/react */

import { useState } from 'react';

import RemoveTaskModal from 'widgets/RemoveTaskModal';

import Modal from 'components/Modal';
import Dropdown from 'components/Dropdown';
import buttonVariants from 'components/Button/constants';
import modalSizes from 'components/Modal/constants';
import Card from 'components/Card';

// Style
import * as style from './view-task-modal-styles';

export default function ViewTaskModal({ task, isOpen, handleClose }) {
  const [isRemoveTaskModalOpened, setIsRemoveTaskModalOpened] = useState(false);

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
            <Dropdown css={style.viewTaskModal_input} label="Branch" />
          </Card>
        </div>
      </Modal>
    </>
  );
}
