/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import GithubService from 'services/GithubService';

import SigninGithubModal from 'widgets/SigninGithubModal';

import * as style from './github-styles';

export default function Github() {
  const user = useSelector((state) => state.USERS.loginReducer.user);

  const [hasFailed, setHasFailed] = useState(false);
  const [isSigninGithubModalOpened, setIsSigninGithubModalOpened] = useState(false);

  const location = useLocation();
  const history = useHistory();
  const params = new URLSearchParams(location.search);
  const code = params.get('code');
  const state = params.get('state');

  if (!user?.id) {
    history.push('/login');
  }

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
