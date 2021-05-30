/** @jsxImportSource @emotion/react */

import Modal from 'components/Modal';
import buttonVariants from 'components/Button/constants';
import modalSizes from 'components/Modal/constants';

// Style
import * as style from './remove-confirmation-modal-styles';

export default function RemoveConfirmationModal({
  isOpen,
  handleClose,
  handleSuccess,
  message,
}) {
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
          onClick: handleSuccess,
          variant: buttonVariants.SMALL.PRIMARY,
        },
        {
          name: 'No',
          onClick: handleClose,
          variant: buttonVariants.SMALL.SECONDARY,
        },
      ]}
    >
      <p css={style.removeConfirmationModal_body}>{message}</p>
    </Modal>
  );
}
