/** @jsxImportSource @emotion/react */

import ReactModal from 'react-modal';

// Style
import * as style from './modal-styles';
import './modal-styles.css';

import Icon from '../Icon';
import Button from '../Button';
import Spinner from '../Spinner';

export default function Modal({
  children,
  handleClose,
  isOpen,
  id,
  title,
  icon,
  actions,
  size,
  isLoading,
  onSubmit,
}) {
  const buttons = (
    <div
      css={
        actions?.length === 2 ? style.modal_actions___two : style.modal_actions___one
      }
    >
      {actions?.map(
        ({ type, name, variant, onClick, disabled, element, ...passedProps }) => (
          <Button
            key={`${title}-${name}`}
            css={style.modal_actions_button}
            type={type}
            variant={variant}
            disabled={disabled || isLoading}
            onClick={onClick}
            element={element}
            {...passedProps}
          >
            {name}
          </Button>
        )
      )}
    </div>
  );

  return (
    <ReactModal
      isOpen={isOpen}
      css={style[`modal___${size}`]}
      id={id}
      onRequestClose={!isLoading ? handleClose : null}
      parentSelector={() => document.querySelector('body')}
      contentLabel="modal"
      ariaHideApp
      shouldFocusAfterRender
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
      shouldReturnFocusAfterClose
    >
      {isLoading && (
        <>
          <Spinner css={style.modal___loading_spinner} />
          <div css={style.modal___loading_background} />
        </>
      )}
      {title && (
        <div css={style.modal_head}>
          <div css={style.modal_iconContainer}>
            <Icon icon={icon} css={style.modal_icon} />
          </div>
          <h2 css={style.modal_title}>{title}</h2>
        </div>
      )}
      {onSubmit ? (
        <form onSubmit={onSubmit}>
          {children}
          {buttons}
        </form>
      ) : (
        <>
          {children}
          {buttons}
        </>
      )}
    </ReactModal>
  );
}

ReactModal.setAppElement(document.getElementById('root'));
