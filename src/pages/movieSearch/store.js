import { ofType } from 'redux-observable'
import { merge, from, interval } from 'rxjs'
import { combineLatest, filter, map, switchMap, throttle, distinctUntilChanged } from 'rxjs/operators'

const API_KEY = 'c950bb6e340adb76324c159ff7b97664'

const CHANGE_PARAM = 'MOVIE_SEARCH/CHANGE_PARAM'
const GET_MOVIES_DONE = 'MOVIE_SEARCH/GET_MOVIES_DONE'

export const changeParam = ({key, value}) => ({
  type: CHANGE_PARAM,
  payload: { key, value }
})

export const handleParamChangeEpic = (action$, state$) => {
  const latestParamChange$ = action$.pipe(
    ofType(CHANGE_PARAM),
    combineLatest(state$, (action, state) => state.movieSearch.params),
    distinctUntilChanged(),
    throttle(() => interval(2000), { leading: true, trailing: true }),
  )

  const emptyQueryChange$ = latestParamChange$.pipe(
    filter(params => !params.query),
    map(() => ({ type: GET_MOVIES_DONE, payload: [] }))
  )

  const nonEmptyQueryChange$ = latestParamChange$.pipe(
    filter(params => params.query),
    map(params => Object.keys(params)
      .map(key => `${key}=${params[key]}`).concat([`api_key=${API_KEY}`])
      .join('&')
    ),
    switchMap(queryString => 
      from(fetch(`https://api.themoviedb.org/3/search/movie?${queryString}`)).pipe(
        switchMap(res => from(res.json()).pipe(
          map(({results: movies}) => ({ type: GET_MOVIES_DONE, payload: movies }))
        )),
      )
    )
  )

  return merge(emptyQueryChange$, nonEmptyQueryChange$)
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