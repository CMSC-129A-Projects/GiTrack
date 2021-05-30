/** @jsxImportSource @emotion/react */

import { useState } from 'react';
import { useSelector } from 'react-redux';

import RemoveConfirmationModal from 'widgets/RemoveConfirmationModal';

import UserImage from 'components/UserImage';
import Modal from 'components/Modal';
import buttonVariants from 'components/Button/constants';
import modalSizes from 'components/Modal/constants';

import BoardService from 'services/BoardService';

// Style
import * as style from './view-member-modal-styles';

export default function ViewMemberModal({
  isOpen,
  handleClose,
  boardId,
  member,
  refreshBoardMembers,
}) {
  const user = useSelector((state) => state.USERS.loginReducer.user);
  const [isRemoveMemberModalOpened, setIsRemoveMemberModalOpened] = useState(false);

  return (
    <>
      {isRemoveMemberModalOpened && (
        <RemoveConfirmationModal
          isOpen={isRemoveMemberModalOpened}
          handleClose={() => setIsRemoveMemberModalOpened(false)}
          handleSuccess={() =>
            BoardService.removeMembers({
              boardId,
              memberId: member.id,
            }).then(() => {
              refreshBoardMembers();
              setIsRemoveMemberModalOpened(false);
              handleClose();
            })
          }
          message="Are you sure you want to remove this member?"
        />
      )}
      <Modal
        size={modalSizes.SM}
        isOpen={isOpen}
        handleClose={handleClose}
        actions={[
          user.id !== member.id
            ? {
                name: 'Remove',
                onClick: () => setIsRemoveMemberModalOpened(true),
                variant: buttonVariants.SMALL.PRIMARY,
              }
            : null,
          {
            name: 'Close',
            onClick: handleClose,
            variant: buttonVariants.SMALL.SECONDARY,
          },
        ].filter((action) => action != null)}
      >
        <div css={style.viewMemberModal}>
          <p css={style.viewMemberModal_heading}>{member.username}</p>
          <UserImage
            css={style.viewMemberModal_image}
            id={member.id}
            name={member.username}
          />
        </div>
      </Modal>
    </>
  );
}
