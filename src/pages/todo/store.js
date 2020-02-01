import { take, put } from "redux-saga/effects"

const ADD_TODO = 'FLOW_CONTROL/ADD_TODO'
const CHANGE_INPUT = 'FLOW_CONTROL/CHANGE_INPUT'
const SHOW_CONGRATULATION = 'FLOW_CONTROL/SHOW_CONGRATULATION'

export function addTodo() {
  return {
    type: ADD_TODO,
  }
}

export function changeInput(text) {
  return {
    type: CHANGE_INPUT,
    payload: text,
  }
}

export function* todoListSaga() {
  for (let i = 0; i < 3; i++) {
    yield take(ADD_TODO)
  }
  yield put({type: SHOW_CONGRATULATION})
}

const initialState = {
  todos: [],
  todo: '',
  showCongratulation: false
}

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO:
      return Object.assign({}, state, {
        todos: [...state.todos, state.todo],
        todo: ''
      })
    case CHANGE_INPUT:
      console.log(state.todo)
      return Object.assign({}, state, { todo: action.payload })
    case SHOW_CONGRATULATION:
      return Object.assign({}, state, {
        showCongratulation: true
      })
    default:
      return state
  }
}