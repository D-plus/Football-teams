export const initialState = {
  currentTeamError: { show: false, message: null },
  enemyTeamScoreError: { show: false, message: null },
  enemyTeamIdError: { show: false, message: null },
};

export const validationErrorsReducer = (state, { type, payload: { field, message } }) => {
  switch (type) {
    case 'SET_ERROR':
      return {
        ...state,
        [field]: { show: true, message },
      };
    case 'RESET_ERROR':
      return {
        ...state,
        [field]: { show: false, message: null },
      };
    case 'CLEAR':
      return initialState;
    default:
      throw new Error('Should not be reached!');
  }
};
