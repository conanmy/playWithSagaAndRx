import { take, put, select, all, race, call, delay } from "redux-saga/effects"

const ADD_TODO = 'FLOW_CONTROL/ADD_TODO'
const REMOVE_TODO = 'TODOLIST/REMOVE_TODO'
const UNDO_REMOVE = 'TODOLIST/UNDO_REMOVE'
const SHOW_UNDO_BUTTON = 'TODOLIST/SHOW_UNDO_BUTTON'
const CHANGE_INPUT = 'FLOW_CONTROL/CHANGE_INPUT'
const SHOW_CONGRATULATION = 'FLOW_CONTROL/SHOW_CONGRATULATION'

export function addTodo() {
  return {
    type: ADD_TODO,
  }
}

export function removeTodo(text) {
  return {
    type: REMOVE_TODO,
    payload: text
  }
}

export function undoRemove() {
  return {
    type: UNDO_REMOVE,
  }
}

export function changeInput(text) {
  return {
    type: CHANGE_INPUT,
    payload: text,
  }
}

export function* todoListSaga() {
  yield all([
    addTodoSaga(),
    removeTodoSaga(),
  ])
}

function* removeTodoSaga() {
  while (true) {
    const action = yield take(REMOVE_TODO)
    let targetTodo = action.payload
    yield put({ type: SHOW_UNDO_BUTTON, payload: true })
    const { undo, remove } = yield race({
      undo: take(UNDO_REMOVE),
      remove: delay(5000),
    })
    yield put({ type: SHOW_UNDO_BUTTON, payload: false })
    if (undo) {
      yield put({ type: ADD_TODO, payload: targetTodo })
    } else if (remove) {
      yield call(syncLocalStorage)
    }
  }
}

function* addTodoSaga() {
  for (let i = 0; i < 3; i++) {
    yield take(action => action.type === ADD_TODO && !action.payload)
    yield call(syncLocalStorage)
  }
  yield put({type: SHOW_CONGRATULATION})
}

function* syncLocalStorage() {
  const state = yield select()
  let todos = state.todoList.todos
  localStorage.setItem('todos', todos.join(','))
}

let localTodos = localStorage.getItem('todos')
const initialState = {
  todos: localTodos ? localTodos.split(',') : [],
  todo: '',
  showCongratulation: false,
  showUndoButton: false,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO:
      return Object.assign({}, state, {
        todos: [...state.todos, action.payload || state.todo],
        todo: ''
      })
    case REMOVE_TODO:
      let indexOfTodo = state.todos.indexOf(action.payload)
      state.todos.splice(indexOfTodo, 1)
      return Object.assign({}, state, {
        todos: [ ...state.todos ]
      })
    case CHANGE_INPUT:
      return Object.assign({}, state, { todo: action.payload })
    case SHOW_CONGRATULATION:
      return Object.assign({}, state, {
        showCongratulation: true
      })
    case SHOW_UNDO_BUTTON:
      return Object.assign({}, state, {
        showUndoButton: action.payload
      })
    default:
      return state
  }
}