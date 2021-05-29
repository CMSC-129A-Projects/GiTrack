/** @jsxImportSource @emotion/react */

import { useState } from 'react';

import RemoveMemberModal from 'widgets/RemoveMemberModal';

import Modal from 'components/Modal';
import buttonVariants from 'components/Button/constants';
import modalSizes from 'components/Modal/constants';

import placeholder from 'assets/images/user-image.svg';

// Style
import * as style from './view-member-modal-styles';

export default function ViewMemberModal({ isOpen, handleClose }) {
  const [isRemoveMemberModalOpened, setIsRemoveMemberModalOpened] = useState(false);

  return (
    <>
      {isRemoveMemberModalOpened && (
        <RemoveMemberModal
          isOpen={isRemoveMemberModalOpened}
          handleClose={() => setIsRemoveMemberModalOpened(false)}
        />
      )}
      <Modal
        size={modalSizes.SM}
        isOpen={isOpen}
        handleClose={handleClose}
        actions={[
          {
            name: 'Remove',
            onClick: () => setIsRemoveMemberModalOpened(true),
            variant: buttonVariants.SMALL.PRIMARY,
          },
          {
            name: 'Close',
            onClick: handleClose,
            variant: buttonVariants.SMALL.SECONDARY,
          },
        ]}
      >
        <div css={style.viewMemberModal}>
          <p css={style.viewMemberModal_heading}>Oaties</p>
          <div css={style.viewMemberModal_imageContainer}>
            <img src={placeholder} alt="user" css={style.viewMemberModal_image} />
          </div>
        </div>
      </Modal>
    </>
  );
}
