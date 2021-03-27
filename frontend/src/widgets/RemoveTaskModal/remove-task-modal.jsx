/** @jsxImportSource @emotion/react */

// Style
import * as style from './remove-task-modal-styles';

import Modal from 'components/Modal';
import buttonVariants from 'components/Button/constants';
import modalSizes from 'components/Modal/constants';

export default function RemoveTaskModal({ isOpen, handleClose }) {
  return (
    <Modal
      size={modalSizes.SM}
      title="Confirm Removal"
      icon="delete"
      isOpen={isOpen}
      handleClose={handleClose}
      actions={[
        {
          name: 'Yes',
          onClick: () => {},
          variant: buttonVariants.SMALL.PRIMARY,
        },
        {
          name: 'No',
          onClick: handleClose,
          variant: buttonVariants.SMALL.SECONDARY,
        },
      ]}
    >
      <p css={style.removeTaskModal_body}>Are you sure you want to remove this task?</p>
    </Modal>
  );
}
