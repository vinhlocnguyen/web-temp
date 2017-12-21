// @flow
import { CALL_API } from '../middleware/api';
import * as Types from '../constants/ActionTypes';
import { request } from '../helpers/request';
import cookie from 'react-cookie';
import type { CategoryState as State, Action } from '../constants/FlowTypes';

/* eslint-disable no-use-before-define */
type GetState = () => State;
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
/* eslint-enable no-use-before-define */

//get all categories
export const handleGetAllCategories = (): Action => {
  return {
    [CALL_API]: {
      types: [Types.GET_ALL_CATEGORY_REQUEST, Types.GET_ALL_CATEGORY_SUCCESS, Types.GET_ALL_CATEGORY_FAILURE],
      endpoint: `/categories`,
      initRequest: request.get(cookie.load('authToken'))
    }
  };
};

export const getAllCategories = (): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleGetAllCategories());
  };
};

export type { ThunkAction }
