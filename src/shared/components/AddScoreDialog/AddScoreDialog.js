import React, { useState, useCallback, useEffect, useReducer } from 'react';
import useHttp from '../../hooks/http';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DatePicker from 'react-datepicker/es';
import InputWithDebounce from '../InputWithDebounce/InputWithDebounce';
import 'react-datepicker/dist/react-datepicker.css';
import { VALIDATION_ERRORS_MESSAGES } from '../../constants/error-messages';
import { initialState, validationErrorsReducer } from './validationErrorsReducer';


const AddScoreDialog = React.memo(({ teamId, onScoreAdded }) => {
  const { sendRequest, isLoading, requestKey } = useHttp();
  const [errorsState, dispatchError] = useReducer(validationErrorsReducer, initialState);
  const [teamIdValidationStatus, setTeamIdValidationStatus] = useState(false);
  const [open, setOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTeamScoreValue, setCurrentTeamScoreValue] = useState('0');
  const [enemyTeamScoreValue, setEnemyTeamScoreValue] = useState('0');
  const [enemyTeamId, setEnemyTeamId] = useState('');

  useEffect(() => {
    dispatchError({ type: 'CLEAR', payload: {} });
    setEnemyTeamScoreValue('0');
    setCurrentTeamScoreValue('0');
    setTeamIdValidationStatus(false);
  }, [open]);

  const toggleOpen = useCallback(() => {
    setOpen(currentState => !currentState);
  }, []);

  const onChangeCurrentTeamScoreValue = useCallback(event => {
    if (errorsState.currentTeamError.show) {
      dispatchError({
        type: 'RESET_ERROR',
        payload: { field: 'currentTeamError' },
      });
    }
    setCurrentTeamScoreValue(event.target.value);
  }, [errorsState.currentTeamError.show]);

  const onChangeEnemyTeamScoreValue = useCallback(event => {
    if (errorsState.enemyTeamScoreError.show) {
      dispatchError({ type: 'RESET_ERROR',
        payload: { field: 'enemyTeamScoreError' },
      });
    }
    setEnemyTeamScoreValue(event.target.value);
  }, [setEnemyTeamScoreValue, errorsState.enemyTeamScoreError.show]);

  const validate = (currentTeamScore, enemyTeamScore, enemyTeamId, teamIdValidationStatus) => {
    let result = true;
    if (!currentTeamScore || !isFinite(currentTeamScore) || currentTeamScore < 0) {
      result = false;
      dispatchError({
        type: 'SET_ERROR',
        payload: {
          field: 'currentTeamError',
          message: VALIDATION_ERRORS_MESSAGES.INSUFFICIENT_NUMBER,
        },
      });
    }
    if (!enemyTeamScore || !isFinite(enemyTeamScore) || enemyTeamScore < 0) {
      result = false;
      dispatchError({
        type: 'SET_ERROR',
        payload: {
          field: 'enemyTeamScoreError',
          message: VALIDATION_ERRORS_MESSAGES.INSUFFICIENT_NUMBER,
        },
      });
    }
    if (!enemyTeamId || !enemyTeamId.trim() || !teamIdValidationStatus) {
      result = false;
      dispatchError({
        type: 'SET_ERROR',
        payload: {
          field: 'enemyTeamIdError',
          message: VALIDATION_ERRORS_MESSAGES.PROVIDE_CORRECT_ID,
        },
      });
    }
    return result;
  };

  const createGameResult = useCallback(async (
    currentTeamScore, enemyTeamScore, date, teamOneId, teamTwoId
  ) => {
    const result = await sendRequest('teams/games/new', {
      date: new Date(date).toISOString(),
      team_one_id: teamOneId,
      team_two_id: teamTwoId,
      team_one_goals: currentTeamScore,
      team_two_goals: enemyTeamScore,
    });

    onScoreAdded(result);
    toggleOpen();
  }, [sendRequest, toggleOpen, onScoreAdded]);

  const handleCreate = useCallback(() => {
    if (validate(currentTeamScoreValue, enemyTeamScoreValue, enemyTeamId, teamIdValidationStatus)) {
      createGameResult(
        currentTeamScoreValue, enemyTeamScoreValue, selectedDate, teamId, enemyTeamId,
      );
    }
  }, [
    createGameResult, currentTeamScoreValue, teamId, enemyTeamId,
    enemyTeamScoreValue, selectedDate, teamIdValidationStatus
  ]);

  const handleValidateTeamId = useCallback(async value => {
    dispatchError({
      type: 'RESET_ERROR',
      payload: { field: 'enemyTeamIdError' },
    });
    setTeamIdValidationStatus(false);

    const response = await sendRequest('teams', { id: value }, 'validateTeamId');
    if (response.success) {
      setEnemyTeamId(value);
      return setTeamIdValidationStatus(response.data && response.data.length);
    }
    setEnemyTeamId(null);
    dispatchError({
      type: 'SET_ERROR',
      payload: {
        field: 'enemyTeamIdError',
        message: VALIDATION_ERRORS_MESSAGES.PROVIDE_CORRECT_ID,
      },
    });
  }, [sendRequest]);

  return (
    <div className='add-score-dialog-wrapper'>
      <Button
        variant='outlined'
        color='primary'
        onClick={ toggleOpen }
      >
        Add a new game result
      </Button>
      <Dialog
        className='add-score-dialog'
        open={ open }
        onClose={ toggleOpen }
        aria-labelledby='form-dialog'
      >
        <DialogTitle>Add a new game result</DialogTitle>
        <DialogContent>
          <div className='add-score-dialog__date-picker-wrapper'>
            <span className='add-score-dialog__date-picker-label'>
              Date of the game
            </span>
            <DatePicker
              selected={ selectedDate }
              onChange={ setSelectedDate }
              dateFormat='dd/MM/yy'
              maxDate={ new Date() }
              inline
            />
          </div>
          <TextField
            label='Goals scored by current team *'
            type='number'
            value={ currentTeamScoreValue }
            onChange={ onChangeCurrentTeamScoreValue }
            InputLabelProps={ { shrink: true } }
            InputProps={ { inputProps: { min: 0 } } }
            error={ errorsState.currentTeamError.show }
            helperText={ errorsState.currentTeamError.message }
          />
          <TextField
            label='Goals scored by enemy team *'
            type='number'
            value={ enemyTeamScoreValue }
            onChange={ onChangeEnemyTeamScoreValue }
            InputLabelProps={ { shrink: true } }
            InputProps={ { inputProps: { min: 0 } } }
            error={ errorsState.enemyTeamScoreError.show }
            helperText={ errorsState.enemyTeamScoreError.message }
          />
          <InputWithDebounce
            label='Enemy team id *'
            type='text'
            onChange={ handleValidateTeamId }
            timeoutTime={ 600 }
            success={ teamIdValidationStatus }
            progress={ isLoading && requestKey === 'validateTeamId' }
            error={ errorsState.enemyTeamIdError.show }
            errorText={ errorsState.enemyTeamIdError.message }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={ toggleOpen }
            color='primary'
          >
            Cancel
          </Button>
          <Button
            onClick={ handleCreate }
            color='primary'
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default AddScoreDialog;
