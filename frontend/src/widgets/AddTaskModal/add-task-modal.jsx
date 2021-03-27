/** @jsxImportSource @emotion/react */

// Style
import * as style from './add-task-modal-styles';

import Modal from 'components/Modal';
import Input from 'components/Input';
import Dropdown from 'components/Dropdown';
import TextEditor from 'components/TextEditor';
import buttonVariants from 'components/Button/constants';
import modalSizes from 'components/Modal/constants';

export default function AddTaskModal({ isOpen, handleClose }) {
  return (
    <Modal
      size={modalSizes.LG}
      title="Create Task"
      icon="create"
      isOpen={isOpen}
      handleClose={handleClose}
      actions={[
        {
          name: 'Create',
          onClick: () => {},
          variant: buttonVariants.SMALL.PRIMARY,
        },
        {
          name: 'Cancel',
          onClick: handleClose,
          variant: buttonVariants.SMALL.SECONDARY,
        },
      ]}
    >
      <Input css={style.addTaskModal_input} label="Title" />
      <div css={style.addTaskModal_input}>
        <p css={style.addTaskModal_label}>Description</p>
        <TextEditor label="Description" />
      </div>
      <Dropdown
        css={style.addTaskModal_input}
        label="Assignee"
        placeholder="Select developer"
      />
      <Dropdown
        css={style.addTaskModal_input}
        label="Branch"
        placeholder="Select branch"
      />
    </Modal>
  );
}
