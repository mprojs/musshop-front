import {IErrorPane} from "../../shared/types/errorPane";
import {cloneObject} from "./objects-utils";

export const convertGraphqlError = (error) => {
  if (!error) {
    return error;
  }
  error = error.toString();
  if (error.toLowerCase().indexOf('graphql error') >= 0) {
    if (error.indexOf(':') >= 0) {
      return error.substr(error.lastIndexOf(':') + 1).trim();
    }

  } else {
    return 'Cannot connect to server. Try again later.';
  }
}

export const convertApiError = (error: IErrorPane) => {
  if (!error || !error.error?.message) {
    return error;
  }
  error = cloneObject(error);
  // console.dir(error);
  let errorMessage = error.error.message.toString();
  if (errorMessage.toLowerCase().indexOf('invalid token') >= 0) {
    error.message = 'Your session has expired.';
    error.addlMessage = 'Please login again.';
    error.redirect = {
      name: 'Login',
      url: '/auth/signin'
    }
  }
  // console.log(error);
  return error;
}
