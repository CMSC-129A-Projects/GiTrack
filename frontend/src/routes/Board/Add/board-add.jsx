/** @jsxImportSource @emotion/react */
import { useForm } from 'react-hook-form';

import Button from 'components/Button';
import buttonVariants from 'components/Button/constants';

import BoardService from 'services/BoardService';

// Style
import * as style from './board-add-styles';

export default function AddBoard() {
  const { register, watch, handleSubmit } = useForm();
  const watchTitle = watch('title', '');

  const onSubmit = (formData) => {
    BoardService.create({ body: formData });
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
