/** @jsxImportSource @emotion/react */
import Add from 'components/Add';
import UserImage from 'components/UserImage';

import * as style from './board-members-styles';

export default function BoardMembers({
  members,
  setMemberToView,
  setIsAddDeveloperModalOpened,
}) {
  return (
    <div css={style.boardMembers} data-testid="boardMembers">
      <Add onClick={() => setIsAddDeveloperModalOpened(true)} />
      {members.map((member) => (
        <button
          data-testid={`member-${member.id}`}
          key={member.id}
          css={style.boardMembers_member}
          onClick={() => setMemberToView(member)}
        >
          <UserImage id={member.id} name={member.username} />
        </button>
      ))}
    </div>
  );
}
