import { combineEpics } from 'redux-observable'
import { handleParamChangeEpic } from './pages/movieSearch/store'

export default combineEpics(
  handleParamChangeEpic,
)