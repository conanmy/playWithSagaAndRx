import { all } from 'redux-saga/effects'
import { todoListSaga } from './pages/todo/store'

export default function* rootSaga() {
  yield all([
    todoListSaga(),
  ])
}