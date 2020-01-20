import { useReducer, useCallback } from 'react';
import { toast } from 'react-toastify';
import { DEFAULT_HTTP_ERROR_MESSAGE, DEFAULT_TOAST_ERROR_MESSAGE } from '../constants/error-messages';

const initialState = {
  loading: false,
  error: null,
  requestKey: null,
};

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        requestKey: action.requestKey,
        error: null,
      };
    case 'RESPONSE':
      return {
        ...curHttpState,
        requestKey: null,
        loading: false,
      };
    case 'ERROR':
      return {
        loading: false,
        error: action.errorMessage,
        requestKey: null,
      };
    case 'CLEAR':
      return initialState;
    default:
      throw new Error('Should not be reached!');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), []);

  const sendRequest = useCallback(
    async (routeName, body, requestKey = null, method = 'POST') => {
      const bodyJSON = JSON.stringify(body);
      dispatchHttp({ type: 'SEND', requestKey });
      try {
        const result = await fetch(`https://alphafx-code-test-api.herokuapp.com/api/${routeName}`, {
          method,
          body: bodyJSON,
          headers: { 'Content-Type': 'application/json' }
        });
        const response = await result.json();
        dispatchHttp({ type: 'RESPONSE' });

        return response;
      } catch {
        toast.dismiss();
        dispatchHttp({
          type: 'ERROR',
          errorMessage: DEFAULT_HTTP_ERROR_MESSAGE,
        });
        toast.error(DEFAULT_TOAST_ERROR_MESSAGE, {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    },
    []
  );

  return {
    isLoading: httpState.loading,
    error: httpState.error,
    sendRequest: sendRequest,
    clear: clear,
    requestKey: httpState.requestKey,
  };
};

export default useHttp;
