/** @jsxImportSource @emotion/react */
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import Button from 'components/Button';
import buttonVariants from 'components/Button/constants';

import BoardService from 'services/BoardService';

// Style
import * as style from './board-add-styles';

export default function AddBoard({ refreshBoards }) {
  const history = useHistory();
  const { register, watch, handleSubmit } = useForm();
  const watchTitle = watch('title', '');

  const onSubmit = (formData) => {
    BoardService.create({ body: formData }).then(({ data: { id: boardId } }) => {
      refreshBoards();
      history.push(`/board/${boardId}`);
    });
  };

  return (
    <form css={style.addBoard} onSubmit={handleSubmit(onSubmit)}>
      <input
        css={style.addBoard_input}
        type="text"
        placeholder="Type board name here..."
        {...register('title', { required: true })}
      />
      <Button
        variant={buttonVariants.LARGE.PRIMARY}
        type="submit"
        onClick={() => {}}
        disabled={watchTitle === ''}
      >
        Create Board
      </Button>
    </form>
  );
}
