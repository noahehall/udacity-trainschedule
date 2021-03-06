import Immutable from 'seamless-immutable';

export function msg (state = Immutable({}), action) {
  return action.type === 'UPDATE_MSG' && typeof action.text === 'string' ?
    Immutable({ ...state, msg: action.text }) :
    state;
}

export function urlCache (state = Immutable({}), action) {
  return action.type === 'UPDATE_URL_CACHE' ?
    Immutable({
      ...state,
                    // puts it at end
      [action.key]: action.modifier ?
        [ ...state[action.key], action.url ] :
        [ action.url, ...state[action.key] ],
    }) :
    state;
}

export function gotRandomSchedule (state = Immutable({}), action) {
  return action.type === 'RANDOM_SCHEDULE' ?
    action.bool :
    state;
}

export function appError (state = Immutable({}), action) {
  return action.type === 'APP_ERROR' ?
    Immutable({
      ...state,
      msg: action.data
    }) :
    state;
}

export function gotStations (state = Immutable({}), action) {
  if (action.type !== 'GOT_STATIONS') return state;

  return Immutable({
    ...state,
    data: {
      ...state.data,
      [action.url]: action.data,
    },
    status: action.status || 'oops'
  });
}

export function gotStationInfo (state = Immutable({}), action) {
  if (action.type !== 'GOT_STATION_INFO') return state;

  return Immutable({
    ...state,
    data: {
      ...state.data,
      [action.url]: action.data,
    },
    status: action.status || 'oops'
  });
}

export function gotSchedules (state = Immutable({}), action) {
  if (action.type !== 'GOT_SCHEDULES') return state;

  switch (action.status) {
    case 'PENDING': {
      return Immutable({
        ...state,
        status: action.status,
      });
    }
    case 'SUCCESS': {
      return Immutable({
        ...state,
        data: {
          ...state.data,
          [action.url]: action.data,
        },
        status: action.status,
      });
    }
    default: {
      return state;
    }
  }
}
