import { combineEpics } from 'redux-observable'
import { handleParamChangeEpic } from './pages/movieSearch/store'
import { todoListEpic } from './pages/todo/store'

export default combineEpics(
  handleParamChangeEpic,
  todoListEpic,
)