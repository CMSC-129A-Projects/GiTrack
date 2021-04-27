/** @jsxImportSource @emotion/react */

import Modal from 'components/Modal';
import Dropdown from 'components/Dropdown';
import buttonVariants from 'components/Button/constants';
import modalSizes from 'components/Modal/constants';

// Style
import * as style from './add-repo-modal-styles';

export default function AddRepoModal({ isOpen, handleClose }) {
  return (
    <Modal
      size={modalSizes.SM}
      title="Add Repository"
      icon="person_add"
      isOpen={isOpen}
      handleClose={handleClose}
      actions={[
        {
          name: 'Add',
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
      <Dropdown css={style.addRepoModal_dropdown} placeholder="Repository" />
    </Modal>
  );
}
