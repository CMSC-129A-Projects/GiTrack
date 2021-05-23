/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';

import GithubService from 'services/GithubService';

import Icon from 'components/Icon';

import * as style from './board-respositories-styles';

export default function BoardRepositiories({
  boardRepos,
  setIsSigninGithubModalOpened,
  setIsAddRepoModalOpened,
}) {
  const [isGithubAuthenticated, setIsGithubAuthenticated] = useState(false);

  useEffect(() => {
    GithubService.status().then(({ data }) => {
      setIsGithubAuthenticated(data.github_authenticated);
    });
  }, []);

  const openModal = () => {
    if (isGithubAuthenticated) {
      setIsAddRepoModalOpened(true);
    } else {
      setIsSigninGithubModalOpened(true);
    }
  };

  return boardRepos.repos === null ? (
    <Icon icon="add" onClick={openModal} onKeyDown={openModal} css={style.repo_add} />
  ) : (
    <>
      {boardRepos.repos.map((repo) => (
        <p css={style.repo_repo}>{repo.full_name.split('/')[1][0]}</p>
      ))}
      <Icon icon="add" onClick={openModal} onKeyDown={openModal} css={style.repo_add} />
    </>
  );
}
