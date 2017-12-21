// @flow
import * as Types from '../constants/ActionTypes';
import type { ThunkAction } from '../actions/suggestion';
import type { Suggestion as State } from '../constants/FlowTypes';

const initState = {
  cities: [],
  countries: [],
  addresses: []
};

const suggestion = (state: State = initState, action: ThunkAction): State => {
  switch (action.type) {
    case Types.SUGGEST_CITY_SUCCESS:
      const cities = action.response.predictions.map(item => item.terms[0].value);
      state.cities = cities;
      return state;

    case Types.SUGGEST_COUNTRY_SUCCESS:
      const countries = action.response.predictions.map(item => item.terms[0].value);
      state.countries = countries;
      return state;

    case Types.SUGGEST_ADDRESS_SUCCESS:
      state.addresses = action.response;
      return state;

    default: return state;
  }
};

export default suggestion;
