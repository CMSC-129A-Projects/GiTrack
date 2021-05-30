/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';

import GithubService from 'services/GithubService';

import Add from 'components/Add';

import * as style from './board-repositories-styles';

export default function BoardRepositiories({
  repos,
  setRepoToView,
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

  return (
    <div css={style.boardRepositories}>
      <Add onClick={openModal} />
      {repos?.repos.map((repo) => (
        <button css={style.boardRepositories_repo} onClick={() => setRepoToView(repo)}>
          <p css={style.boardRepositories_repo_text}>
            {repo.full_name.split('/')[1][0].toUpperCase()}
          </p>
        </button>
      ))}
    </div>
  );
}
