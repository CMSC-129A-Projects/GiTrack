/** @jsxImportSource @emotion/react */
import { useForm, Controller } from 'react-hook-form';

import TasksService from 'services/TasksService';

import Modal from 'components/Modal';
import Input from 'components/Input';
import TextEditor from 'components/TextEditor';
import buttonVariants from 'components/Button/constants';
import modalSizes from 'components/Modal/constants';

// Style
import * as style from './add-task-modal-styles';

export default function AddTaskModal({
  boardId,
  refreshBoardTasks,
  isOpen,
  handleClose,
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = ({ title, description }) => {
    TasksService.create({
      body: {
        board_id: boardId,
        title,
        description,
      },
    }).then(() => {
      handleClose();
      refreshBoardTasks();
    });
  };

  return (
    <Modal
      size={modalSizes.LG}
      title="Create Task"
      icon="create"
      isOpen={isOpen}
      handleClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      actions={[
        {
          name: 'Create',
          type: 'submit',
          variant: buttonVariants.SMALL.PRIMARY,
          onClick: () => {},
        },
        {
          name: 'Cancel',
          variant: buttonVariants.SMALL.SECONDARY,
          onClick: handleClose,
        },
      ]}
    >
      <Input
        css={style.addTaskModal_input}
        label="Title"
        error={errors.title ? errors.title.message : null}
        {...register('title', { required: 'Please input the title' })}
      />
      <div css={style.addTaskModal_input}>
        <p css={style.addTaskModal_label}>Description</p>
        <Controller
          name="description"
          control={control}
          defaultValue=""
          render={({ field: { onChange } }) => <TextEditor onChange={onChange} />}
        />
      </div>
    </Modal>
  );
}
