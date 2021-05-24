/** @jsxImportSource @emotion/react */
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import Logo from 'assets/images/logo.svg';

import Icon from 'components/Icon';
import Card from 'components/Card';
import UserImage from 'components/UserImage';

import useOnClickOutside from 'hooks/useOnClickOutside';

import placeholder from 'assets/images/user-image.svg';

// Style
import * as style from './navbar-styles';

export default function Navbar({ boards, ...passedProps }) {
  const boardRef = useRef();
  const userRef = useRef();

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isBoardsDropdownOpen, setIsBoardsDropdownOpen] = useState(false);

  useOnClickOutside(boardRef, () => setIsBoardsDropdownOpen(false));
  useOnClickOutside(userRef, () => setIsUserDropdownOpen(false));

  return (
    <div css={style.navbar} {...passedProps}>
      <div css={style.navbar_nav}>
        <div css={style.navbar_imageContainer}>
          <img src={Logo} alt="gitrack logo" css={style.navbar_image} />
        </div>
        <div css={style.navbar_boardsContainer} ref={boardRef}>
          <button
            css={style.navbar_boardsButton}
            onClick={() => setIsBoardsDropdownOpen(!isBoardsDropdownOpen)}
          >
            Boards
            <Icon icon="expand_more" />
          </button>
          {isBoardsDropdownOpen && (
            <Card css={style.navbar_boardsDropdown}>
              {boards.map((board) => (
                <Link
                  to={`/board/${board.id}`}
                  css={style.navbar_boardsDropdown_button}
                  onClick={() => setIsBoardsDropdownOpen(false)}
                >
                  <Icon
                    css={style.navbar_boardsDropdown_button_icon}
                    icon="space_dashboard"
                  />
                  {board.title}
                </Link>
              ))}
              <Link
                to="/board/add"
                css={style.navbar_boardsDropdown_button___add}
                onClick={() => setIsBoardsDropdownOpen(false)}
              >
                <Icon
                  css={style.navbar_boardsDropdown_button_icon}
                  icon="add_circle_outline"
                />
                Add Board
              </Link>
            </Card>
          )}
        </div>
      </div>
      <div css={style.navbar_user} ref={userRef}>
        <button
          css={style.navbar_userButton}
          onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
        >
          <UserImage image={placeholder} />
        </button>
        {isUserDropdownOpen && (
          <Card css={style.navbar_actionsDropdown}>
            <Link to="/logout" css={style.navbar_actionsDropdown_button}>
              <Icon css={style.navbar_actionsDropdown_button_icon} icon="exit_to_app" />
              Logout
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
