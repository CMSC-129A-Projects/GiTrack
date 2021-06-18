/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';

import Card from 'components/Card';
import Icon from 'components/Icon';
import UserImage from 'components/UserImage';

// Style
import * as style from './task-card-styles';

export default function TaskCard({
  title,
  members,
  assignees,
  tag,
  targetDate,
  onClick,
  ...passedProps
}) {
  const [isPastDeadline, setIsPastDeadline] = useState(false);
  const assignedDevs = members.filter((member) => assignees.includes(member.id));

  useEffect(() => {
    const taskDate = new Date(targetDate);
    const dateNow = Date.now();

    if (dateNow > taskDate.getTime() && taskDate.getTime() > 0) {
      setIsPastDeadline(true);
    }
  }, []);

  return (
    <Card
      data-testid="taskCard"
      onClick={onClick}
      css={[style.taskCard, isPastDeadline ? style.taskCard___red : null]}
      {...passedProps}
    >
      <div css={style.taskCard_header}>
        <p css={style.taskCard_title}>
          {title}
          {isPastDeadline && <Icon icon="warning" css={style.taskCard_warningIcon} />}
        </p>
        <div css={style.taskCard_assignees}>
          {assignedDevs?.map((assignee) => (
            <UserImage
              css={style.taskCard_userImage}
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
