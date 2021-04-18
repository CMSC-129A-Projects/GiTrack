const user = {
  HASH: 'HASH',
  DUPLICATE_USER: 'DUPLICATE_USER',
  DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
  INSERT_FAILED: 'INSERT_FAILED',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  MISSING_REFRESH_TOKEN: 'MISSING_REFRESH_TOKEN',
  MISSING_USERNAME: 'MISSING_USERNAME',
  MISSING_PASSWORD: 'MISSING_PASSWORD',
  MISSING_EMAIL: 'MISSING_EMAIL',
  TOKEN_INVALID: 'TOKEN_INVALID',
};

const board = {
  INSERT_FAILED: 'INSERT_FAILED',
  EDIT_FAILED: 'EDIT_FAILED',
  DELETE_FAILED: 'DELETE_FAILED',
  GET_FAILED: 'GET_FAILED',
  NOT_ENOUGH_PERMISSIONS: 'NOT_ENOUGH_PERMISSIONS',
  NOT_MEMBER_OF_BOARD: 'NOT_MEMBER_OF_BOARD',
  MISSING_TITLE: 'MISSING_TITLE',
  MISSING_ID: 'MISSING_ID',
  MISSING_NAME: 'MISSING_NAME',
  MISSING_USER_ID: 'MISSING_USER_ID',
};

const task = {
  INSERT_FAILED: 'INSERT_FAILED',
  MISSING_TITLE : 'MISSING_TITLE',
  MISSING_DESCRIPTION : 'MISSING_DESCRIPTION'
}

const logic = {
  INACCESSIBLE_CODE: 'INACCESSIBLE_CODE',
};

module.exports = { user, board, logic, task };
