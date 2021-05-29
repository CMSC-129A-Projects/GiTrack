/** @jsxImportSource @emotion/react */

import Modal from 'components/Modal';
import buttonVariants from 'components/Button/constants';
import modalSizes from 'components/Modal/constants';

// Style
import * as style from './remove-member-modal-styles';

export default function RemoveMemberModal({ isOpen, handleClose }) {
  return (
    <Modal
      size={modalSizes.MD}
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
      <p css={style.removeMemberModal_body}>
        Are you sure you want to remove this member?
      </p>
    </Modal>
  );
}
