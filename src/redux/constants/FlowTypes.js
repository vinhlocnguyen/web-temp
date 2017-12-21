// @flow
import { CALL_API } from '../middleware/api';
/* eslint-disable no-use-before-define */
export type User = {
  id: string,
  firstName: string,
  lastName: string,
  avatarUrl: string,
  buildingRef: string,
  flatTurtleAdmin: boolean,
  language: string,
  phoneNumber: string,
  privateEmail: string,
  favouriteAddresses: Array<Object>,
  workEmail: string,
  transportMethods: Array<Object>
};

export type Building = {
  address: string,
  concierge: {
    email: ?string,
    phone: ?string
  },
  geolocation: Array<number>,
  id: string,
  image: {
    full: string,
    mobile: ?string,
    tablet: ?string
  },
  manager: ?Array<User>,
  name: string,
  nearbyStops: Array<Object>,
  openingHours: {
    from: ?string,
    to: ?string
  },
  owner: ?User,
  region: string,
  timezone: {
    tzName: ?string,
    tzOffset: ?string
  }
};

export type Category = {
  id: string,
  name: string
}

export type MeetingRoom = {
  name: string,
  description: ?string,
  floor: string,
  room: string,
  price: number,
  currency: string,
  maxNbPersons: number,
  openingHours: {
    from: string,
    to: string
  },
  building: string,
  isCateringIncluded: boolean,
  image: {
    thumbnail: ?string,
    full: ?string
  },
  schedule: Object,
  overlap: ?number,
  min_time_block: ?string,
  max_time_block: ?string,
  closing_days: Array<any>,
}

export type Error = {
  status: ?number,
  text: ?string
}

// export type Address = {
//   street: string,
//   city: string,
//   state: string,
//   country: string
// };

// export type SearchingBuilding = {
//   id: string,
//   address: string,
//   name: string
// }

export type Service = {
  id: string,
  name: string,
  address: string,
  category: string,
  description: ?string,
  geolocation: ?Array<number>,
  image: {
    full: ?string,
    thumbnail: ?string
  },
  manager: Array<User>,
  openingHours: {
    from: ?string,
    to: ?string
  },
  phoneNumber: ?string,
  rating: ?number
}

// Redux state type

export type Report = {
  isReported: boolean,
  isResolved: boolean
};

export type Action = {
  [CALL_API]: {
    types: Array<string>,
    enpoint: string,
    initRequest: Object
  }
}

export type Suggestion = {
  cities: Array<string>,
  countries: Array<string>,
  addresses: Array<string>
}

export type BuildingState = {
  current: ?Building | {},
  list: Array<Building>,
  error?: Error,
  suggestionStops: Array<Object>,
  selected: ?Building | {}
}

export type CategoryState = {
  list: Array<Category>,
  error?: Error
}

export type MeetingRoomState = {
  selected: ?MeetingRoom | {},
  list: Object,
  filters: Array<any>,
  filterCondition: ?Object,
  isCheckedAll: boolean,
  openNow: boolean,
  error: any
}

export type ServiceState = {
  selected: {},
  list: [],
  filters: [],
  isCheckedAll: true,
  openNow: false
}

export type TransportState  = {
  publicTransports: [],
  home: {},
  filters: []
}

export type UserState = {
  isAuthenticated: boolean,
  isRegistered: boolean,
  isAdministrator: boolean,
  isConfirmed: boolean,
  isUpdatedInfo: boolean,
  info: Object,
  waitingConfirm: boolean,
  phoneNumber: {
    isWaitingConfirm: boolean,
    isVerified: boolean,
    number: string | null
  },
  bookings: any,
  list: Array<User>,
  selected: Object
}

/* eslint-enable no-use-before-define */
