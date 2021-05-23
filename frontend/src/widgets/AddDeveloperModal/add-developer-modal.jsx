/** @jsxImportSource @emotion/react */

import Modal from 'components/Modal';
import Input from 'components/Input';
import buttonVariants from 'components/Button/constants';
import modalSizes from 'components/Modal/constants';

// Style
import * as style from './add-developer-modal-styles';

export default function AddDeveloperModal({ isOpen, handleClose }) {
  return (
    <Modal
      size={modalSizes.SM}
      title="Add People"
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
      <Input css={style.addDeveloperModal_input} placeholder="Email address" />
    </Modal>
  );
}
