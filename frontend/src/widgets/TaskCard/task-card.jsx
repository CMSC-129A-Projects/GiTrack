/** @jsxImportSource @emotion/react */

import Card from 'components/Card';
import UserImage from 'components/UserImage';

// Style
import * as style from './task-card-styles';

export default function TaskCard({
  children,
  title,
  members,
  assignees,
  tag,
  onClick,
  ...passedProps
}) {
  const assignedDevs = members.filter((member) => assignees.includes(member.id));

  return (
    <Card onClick={onClick} css={style.taskCard} {...passedProps}>
      <div css={style.taskCard_header}>
        <p css={style.taskCard_title}>{title}</p>
        <div css={style.taskCard_assignees}>
          {assignedDevs?.map((assignee) => (
            <UserImage
              key={`img-${assignee.id}`}
              id={assignee.id}
              name={assignee.username}
            />
          ))}
        </div>
      </div>
      {tag && <p css={style.taskCard_tag}>{tag}</p>}
    </Card>
  );
}
