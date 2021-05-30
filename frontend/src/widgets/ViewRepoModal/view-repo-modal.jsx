/** @jsxImportSource @emotion/react */

import { useState } from 'react';

import RemoveConfirmationModal from 'widgets/RemoveConfirmationModal';

import Modal from 'components/Modal';
import buttonVariants from 'components/Button/constants';
import modalSizes from 'components/Modal/constants';

import BoardService from 'services/BoardService';

// Style
import * as style from './view-repo-modal-styles';

const convertURL = (url) => {
  const repoURL = url.split('repos/')[1];

  return `https://github.com/${repoURL}`;
};

export default function ViewRepoModal({
  isOpen,
  handleClose,
  boardId,
  repo,
  refreshBoardRepos,
}) {
  const [isRemoveRepoModalOpened, setIsRemoveRepoModalOpened] = useState(false);

  return (
    <>
      {isRemoveRepoModalOpened && (
        <RemoveConfirmationModal
          isOpen={isRemoveRepoModalOpened}
          handleClose={() => setIsRemoveRepoModalOpened(false)}
          handleSuccess={() => {
            BoardService.removeRepository({
              boardId,
              repoId: repo.id,
            }).then(() => {
              refreshBoardRepos();
              setIsRemoveRepoModalOpened(false);
              handleClose();
            });
          }}
          message="Are you sure you want to remove this repository?"
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
        <p css={style.viewRepoModal_heading}>{repo.full_name.split('/')[1]}</p>
        <a
          href={convertURL(repo.url)}
          target="_blank"
          rel="noreferrer"
          css={style.viewRepoModal_body}
        >
          {convertURL(repo.url)}
        </a>
      </Modal>
    </>
  );
}
