/** @jsxImportSource @emotion/react */

import { useState, useEffect } from 'react';

import GithubService from 'services/GithubService';

import Logo from 'assets/images/GitHub-Mark.png';
import LogoText from 'assets/images/GitHub_Logo.svg';

import Modal from 'components/Modal';
import buttonVariants from 'components/Button/constants';
import modalSizes from 'components/Modal/constants';

// Style
import * as style from './signin-github-modal-styles';

export default function SigninGithubModal({ isOpen, handleClose, hasFailed }) {
  const [signInLink, setSignInLink] = useState('');

  useEffect(() => {
    GithubService.link().then(({ data }) => {
      if (data.error_message === null) {
        setSignInLink(data.url);
      }
    });
  }, []);

  return (
    <Modal
      size={modalSizes.SM}
      title="Add Repository"
      icon="person_add"
      isOpen={isOpen}
      handleClose={handleClose}
      actions={[
        {
          name: 'Sign in with OAuth',
          element: 'a',
          href: signInLink,
          target: '_self',
          variant: buttonVariants.SMALL.PRIMARY,
        },
      ]}
    >
      <div css={style.signinGithubModal}>
        <p css={style.signinGithubModal_text}>
          {hasFailed
            ? 'There was an error connecting to GitHub. Please try again'
            : 'Sign in to GitHub first'}
        </p>
        <div css={style.signinGithubModal_images}>
          <div css={style.signinGithubModal_imageContainer}>
            <img src={Logo} alt="github logo" css={style.signinGithubModal_image} />
          </div>
          <div css={style.signinGithubModal_imageTextContainer}>
            <img src={LogoText} alt="github logo" css={style.signinGithubModal_image} />
          </div>
        </div>
      </div>
    </Modal>
  );
}

SigninGithubModal.defaultProps = {
  hasFailed: false,
};
