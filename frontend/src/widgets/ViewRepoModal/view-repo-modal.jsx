/** @jsxImportSource @emotion/react */

import { useState } from 'react';

import RemoveRepoModal from 'widgets/RemoveRepoModal';

import Modal from 'components/Modal';
import buttonVariants from 'components/Button/constants';
import modalSizes from 'components/Modal/constants';

import placeholder from 'assets/images/user-image.svg';

// Style
import * as style from './view-repo-modal-styles';

export default function ViewRepoModal({ isOpen, handleClose }) {
  const [isRemoveRepoModalOpened, setIsRemoveRepoModalOpened] = useState(false);

  return (
    <>
      {isRemoveRepoModalOpened && (
        <RemoveRepoModal
          isOpen={isRemoveRepoModalOpened}
          handleClose={() => setIsRemoveRepoModalOpened(false)}
        />
      )}
      <Modal
        size={modalSizes.SM}
        isOpen={isOpen}
        handleClose={handleClose}
        actions={[
          {
            name: 'Remove',
            onClick: () => setIsRemoveRepoModalOpened(true),
            variant: buttonVariants.SMALL.PRIMARY,
          },
          {
            name: 'Close',
            onClick: handleClose,
            variant: buttonVariants.SMALL.SECONDARY,
          },
        ]}
      >
        <div css={style.viewRepoModal}>
          <p css={style.viewRepoModal_heading}>RepoName</p>
          <div css={style.viewRepoModal_imageContainer}>
            <img src={placeholder} alt="user" css={style.viewRepoModal_image} />
          </div>
        </div>
      </Modal>
    </>
  );
}
