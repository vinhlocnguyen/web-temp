/*@flow*/

import { CALL_API } from '../middleware/api';
import * as Types from '../constants/ActionTypes';
import { request } from '../helpers/request';
import cookie from 'react-cookie';
import type { Suggestion as State, Action } from '../constants/FlowTypes';

/* eslint-disable no-use-before-define */
type GetState = () => State;
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;

/* eslint-enable no-use-before-define */

// auto suggestion country
const handleSuggestCountry = (input: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.SUGGEST_COUNTRY_REQUEST, Types.SUGGEST_COUNTRY_SUCCESS, Types.SUGGEST_COUNTRY_FAILURE],
      endpoint: `/places/suggestions/country?input=${input}`,
      initRequest: request.get(cookie.load('authToken'))
    }
  };
};

export const suggestCountry = (input: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch(handleSuggestCountry(input));
  };
};

// auto suggestion city
const handleSuggestCity = (input: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.SUGGEST_CITY_REQUEST, Types.SUGGEST_CITY_SUCCESS, Types.SUGGEST_CITY_FAILURE],
      endpoint: `/places/suggestions/city?input=${input}`,
      initRequest: request.get(cookie.load('authToken'))
    }
  };
};

export const suggestCity = (input: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch(handleSuggestCity(input));
  };
};

// auto suggestion address
const handleSuggestAddress = (input: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.SUGGEST_ADDRESS_REQUEST, Types.SUGGEST_ADDRESS_SUCCESS, Types.SUGGEST_ADDRESS_FAILURE],
      endpoint: `/places/suggestions/address?input=${input}`,
      initRequest: request.get(cookie.load('authToken'))
    }
  };
};

export const suggestAddress = (input: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleSuggestAddress(input));
  };
};

export type { ThunkAction }