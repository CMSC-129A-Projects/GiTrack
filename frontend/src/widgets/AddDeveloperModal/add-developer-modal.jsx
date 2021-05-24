/** @jsxImportSource @emotion/react */
import { useForm } from 'react-hook-form';

import BoardsService from 'services/BoardsService';
import UserService from 'services/UserService';

import Modal from 'components/Modal';
import Input from 'components/Input';
import buttonVariants from 'components/Button/constants';
import modalSizes from 'components/Modal/constants';

// Style
import * as style from './add-developer-modal-styles';

export default function AddDeveloperModal({
  boardId,
  refreshBoardMembers,
  isOpen,
  handleClose,
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = ({ emails }) => {
    UserService.exists({
      params: {
        emails,
      },
    })
      .then(({ data: { ids } }) => {
        if (ids != null) {
          BoardsService.addDevelopers({
            boardId,
            body: {
              developer_ids: ids,
            },
          }).then(() => {
            refreshBoardMembers();
            handleClose();
          });
        }
      })
      .catch(() => {
        setError('email_address', {
          type: 'manual',
          message: 'One or more users do not exist',
        });
      });
  };

  return (
    <Modal
      size={modalSizes.SM}
      title="Add People"
      icon="person_add"
      isOpen={isOpen}
      handleClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      actions={[
        {
          name: 'Add',
          onClick: () => {},
          type: 'submit',
          variant: buttonVariants.SMALL.PRIMARY,
        },
        {
          name: 'Cancel',
          onClick: handleClose,
          variant: buttonVariants.SMALL.SECONDARY,
        },
      ]}
    >
      <Input
        css={style.addDeveloperModal_input}
        error={errors.email_address ? errors.email_address.message : null}
        placeholder="Email address"
        {...register('emails', { required: 'Please input an email address' })}
      />
      <p css={style.addDeveloperModal_note}>
        <strong>Note:</strong> To invite multiple people, enter multiple email addresses
        separated by commas (,)
      </p>
    </Modal>
  );
}
