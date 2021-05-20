/** @jsxImportSource @emotion/react */

import placeholder from 'assets/images/user-image.svg';

// Style
import * as style from './user-image-styles';

export default function UserImage({ image, ...passedProps }) {
  return (
    <img css={style.userImage} alt="user" src={image || placeholder} {...passedProps} />
  );
}
