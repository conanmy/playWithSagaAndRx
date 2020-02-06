import { put, select, all, throttle } from "redux-saga/effects"

const API_KEY = 'c950bb6e340adb76324c159ff7b97664'

const CHANGE_PARAM = 'MOVIE_SEARCH/CHANGE_PARAM'
const GET_MOVIES_DONE = 'MOVIE_SEARCH/GET_MOVIES_DONE'

export const changeParam = ({key, value}) => ({
  type: CHANGE_PARAM,
  payload: { key, value }
})

export function* movieSearchSaga() {
  yield all([
    controlParamChange()
  ])
}

function* controlParamChange() {
  yield throttle(2000, CHANGE_PARAM, handleParamChange)
}

function* handleParamChange() {
  const { movieSearch: { params } } = yield select()
  if (params.query) {
    const queryString = Object.keys(params)
      .map(key => `${key}=${params[key]}`).concat([`api_key=${API_KEY}`])
      .join('&')
    let res = yield fetch(`https://api.themoviedb.org/3/search/movie?${queryString}`)
    const { results: movies } = yield res.json()
    yield put({type: GET_MOVIES_DONE, payload: movies})
  } else {
    yield put({type: GET_MOVIES_DONE, payload: []})
  }
}

const initialState = {
  params: {},
  dataSource: {
    data: []
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case CHANGE_PARAM:
      return Object.assign({}, state, {
        params: { ...state.params, [action.payload.key]: action.payload.value }
      })
    case GET_MOVIES_DONE:
      return Object.assign({}, state, {
        dataSource: { data: action.payload }
      })
    default:
      return state
  }
}