/** @jsxImportSource @emotion/react */

import Card from 'components/Card';

// Style
import * as style from './taskcard-styles';

export default function TaskCard({ children, title, body, assignee, tag, ...passedProps }) {
  return (
    <div css={style.taskCard} {...passedProps}>
      <Card>
        <div css={style.taskCard_header}>
          <p css={style.taskCard_title}>
            {title}
          </p>
          <div css={style.taskCard_image}>
            <img src={assignee} alt="user" css={style.taskCard_imageContainer}/>
          </div>
        </div>
        <p css={style.taskCard_body}>
          {body}
        </p>
        <p css={style.taskCard_tag}>
          {tag}
        </p>
      </Card>
      {children}
    </div>
  );
}
