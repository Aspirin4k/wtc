type ErrorHandleResult = [object, string];

export const getProcessedError = (error: any): ErrorHandleResult => {
  let errorObject = {};
  let errorString = '';
  switch (true) {
    case !!error.response && !!error.response.data:
      errorObject = {
        error: error.response.data
      };
      errorString = JSON.stringify(errorObject);
      break;
    case !!error.message:
      errorObject = {
        error: error.message,
        stack: error.stack && error.stack.split("\n"),
      }
      errorString = error.message + "<br>" + (error.stack && error.stack.split("\n").join("<br>") || '');
      break;
  }

  return [errorObject, errorString];
}