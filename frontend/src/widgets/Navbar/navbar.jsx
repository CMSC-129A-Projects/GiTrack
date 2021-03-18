/** @jsxImportSource @emotion/react */

import Logo from 'assets/images/logo.svg'

// Style
import * as style from './navbar-styles';

export default function Navbar({ ...passedProps }) {
  return (
    <div css={style.navbar} {...passedProps}>
      <div>
        <img src={Logo} alt="gitrack logo" />
      </div>
    </div>
  );
}
