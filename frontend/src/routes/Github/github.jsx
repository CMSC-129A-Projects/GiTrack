/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import GithubService from 'services/GithubService';

import SigninGithubModal from 'widgets/SigninGithubModal';

import * as style from './github-styles';

export default function Github() {
  const [hasFailed, setHasFailed] = useState(false);
  const [isSigninGithubModalOpened, setIsSigninGithubModalOpened] = useState(false);

  const location = useLocation();
  const history = useHistory();
  const params = new URLSearchParams(location.search);
  const code = params.get('code');
  const state = params.get('state');

  useEffect(() => {
    GithubService.callback({
      params: {
        code,
        state,
      },
    })
      .then((data) => {
        if (data.error_message === null) {
          history.push('/boards');
        } else {
          setHasFailed(true);
          setIsSigninGithubModalOpened(true);
        }
      })
      .catch((err) => {
        if (err.response.status === 500) {
          history.push('/boards');
        } else {
          setHasFailed(true);
          setIsSigninGithubModalOpened(true);
        }
      });
  }, []);

  return (
    <div css={style.github}>
      <h1 css={style.github_h1}>Connecting Github Account...</h1>
      {hasFailed && (
        <SigninGithubModal
          isOpen={isSigninGithubModalOpened}
          handleClose={() => setIsSigninGithubModalOpened(false)}
          hasFailed={hasFailed}
        />
      )}
    </div>
  );
}
