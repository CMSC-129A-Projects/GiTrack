/** @jsxImportSource @emotion/react */

import { useState, useEffect } from 'react';

import GithubService from 'services/GithubService';
import BoardService from 'services/BoardService';

import Modal from 'components/Modal';
import Dropdown from 'components/Dropdown';
import buttonVariants from 'components/Button/constants';
import modalSizes from 'components/Modal/constants';

// Style
import * as style from './add-repo-modal-styles';

export default function AddRepoModal({
  boardId,
  isOpen,
  handleClose,
  refreshBoardRepos,
}) {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);

  useEffect(() => {
    GithubService.repos()
      .then(({ data }) => {
        if (data.error_message === null) {
          const dataRepos = data.repos.map((repo) => ({
            ...repo,
            label: repo.full_name,
          }));
          setRepos(dataRepos);
        }
      })
      .catch(({ response }) => {
        setRepos(response.data.repos);
      });
  }, []);

  const onAddClick = () => {
    if (selectedRepo === null) {
      return;
    }

    BoardService.connectRepo({
      boardId,
      body: {
        id: selectedRepo.id,
        full_name: selectedRepo.full_name,
        url: selectedRepo.url,
      },
    })
      .then(() => {
        handleClose();
        refreshBoardRepos();
      })
      .catch(() => {
        handleClose();
      });
  };

  return (
    <Modal
      size={modalSizes.MD}
      title="Add Repository"
      icon="person_add"
      isOpen={isOpen}
      handleClose={handleClose}
      actions={[
        {
          name: 'Add',
          onClick: onAddClick,
          variant: buttonVariants.SMALL.PRIMARY,
          disabled: selectedRepo === null,
        },
        {
          name: 'Cancel',
          onClick: handleClose,
          variant: buttonVariants.SMALL.SECONDARY,
        },
      ]}
    >
      <Dropdown
        css={style.addRepoModal_dropdown}
        placeholder="Repository"
        options={repos}
        onChange={(option) => setSelectedRepo(option)}
      />
    </Modal>
  );
}
