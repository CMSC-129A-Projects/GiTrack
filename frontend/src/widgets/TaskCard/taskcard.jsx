/** @jsxImportSource @emotion/react */

import Card from 'components/Card';
import placeholder from 'assets/images/user-image.svg';

// Style
import * as style from './taskcard-styles';

export default function TaskCard({
  children,
  title,
  body,
  assigneeImage,
  tag,
  ...passedProps
}) {
  return (
    <Card css={style.taskCard} {...passedProps}>
      <div css={style.taskCard_header}>
        <p css={style.taskCard_title}>{title}</p>
        <div css={style.taskCard_image}>
          <img
            src={assigneeImage || placeholder}
            alt="user"
            css={style.taskCard_imageContainer}
          />
        </div>
      </div>
      <p css={style.taskCard_body}>{body}</p>
      {tag && <p css={style.taskCard_tag}>{tag}</p>}
    </Card>
  );
}
