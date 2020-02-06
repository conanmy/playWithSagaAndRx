import { all } from 'redux-saga/effects'
import { todoListSaga } from './pages/todo/store'
import { movieSearchSaga } from './pages/movieSearch/store'

export default function* rootSaga() {
  yield all([
    todoListSaga(),
    movieSearchSaga(),
  ])
}