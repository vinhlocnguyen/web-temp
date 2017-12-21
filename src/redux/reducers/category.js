// @flow
import merge from '../helpers/deepMerge';
import * as Types from '../constants/ActionTypes';
import { IMAGE } from '../../../config';
import type { ThunkAction } from '../actions/category';
import type { CategoryState as State } from '../constants/FlowTypes';

const updateDefaultCategory = (categories: Array<Object>) => {
  categories.forEach(cat => {
    let name = cat.name.toLowerCase();
    let icon = IMAGE.DEFAULT_CATEGORY[name];
    IMAGE.DEFAULT_CATEGORY[cat.id] = icon;
  });
};

const initState = {
  list: [],
  error: {
    status: null,
    text: null
  }
};

const category = (state: State = initState, action: ThunkAction): State => {
  switch (action.type) {
    case Types.GET_ALL_CATEGORY_SUCCESS:
      updateDefaultCategory(action.response);
      action.response = action.response.map(c => {
        if (c.name.toLowerCase() === 'restaurant') c.name = 'Food and beverages';
        return {
          id: c.id,
          name: c.name,
          value: c.id
        };
      });
      state.list = merge([], action.response);
      return merge({}, state);
    default: return state;
  }
};

export default category;
