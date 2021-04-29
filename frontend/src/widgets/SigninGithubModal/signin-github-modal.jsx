/** @jsxImportSource @emotion/react */

import Logo from 'assets/images/GitHub-Mark.png';
import LogoText from 'assets/images/GitHub_Logo.svg';

import Modal from 'components/Modal';
import buttonVariants from 'components/Button/constants';
import modalSizes from 'components/Modal/constants';

// Style
import * as style from './signin-github-modal-styles';

export default function SigninGithubModal({ isOpen, handleClose }) {
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
          onClick: () => {},
          variant: buttonVariants.SMALL.PRIMARY,
        },
      ]}
    >
      <div css={style.signinGithubModal}>
        <p css={style.signinGithubModal_text}>Sign in to GitHub first</p>
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
