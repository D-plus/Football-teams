import React, { useEffect, useCallback, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

const InputWithDebounce = React.memo((
  { onChange, timeoutTime, error, errorText, label, type, success, progress }
) => {
  const [previousValue, setPreviousValue] = useState('');
  const [currentValue, setCurrentValue] = useState('');

  const handleInput = useCallback((event) => {
    setCurrentValue(event.target.value);
  }, []);

  const handleChange = useEffect(() => {
    let timeout;
    if (currentValue !== previousValue) {
      timeout = setTimeout(() => {
        setPreviousValue(currentValue);

        onChange(currentValue);
      }, timeoutTime);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [timeoutTime, currentValue, onChange, previousValue]);

  return (
    <div className='input-with-debounce'>
      <TextField
        label={ label }
        type={ type }
        value={ currentValue }
        onInput={ handleInput }
        onChange={ handleChange }
        InputLabelProps={ { shrink: true } }
        error={ error }
        helperText={ errorText }
      />
      { success && (
        <FontAwesomeIcon
          className='input-with-debounce__success'
          icon={ faCheckCircle }
        />
      ) }
      { progress && <div className="input-with-debounce__progress"/> }
    </div>
  );
});

export default InputWithDebounce;
