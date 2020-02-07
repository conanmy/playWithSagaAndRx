import {
  bufferCount, delay, map, mapTo, filter, bufferWhen,
  withLatestFrom, tap, sequenceEqual, combineLatest
} from 'rxjs/operators'
import { ofType, combineEpics } from 'redux-observable'
import { from, merge } from 'rxjs'

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

const removeTodoEpic = action$ => action$.pipe(
  ofType(REMOVE_TODO),
  mapTo({ type: SHOW_UNDO_BUTTON, payload: true })
)

const undoRemoveEpic = action$ => action$.pipe(
  ofType(UNDO_REMOVE),
  mapTo({ type: SHOW_UNDO_BUTTON, payload: false })
)

const undoDelayEpic = (action$, state$) => {
  const removeTodo$ = action$.pipe(ofType(REMOVE_TODO))
  const delay$ = removeTodo$.pipe(delay(5000))
  const undo$ = action$.pipe(ofType(UNDO_REMOVE))

  const undoRemove$ = undo$.pipe(
    combineLatest(removeTodo$, (undo, removeTodo) => removeTodo),
    map(removeAction => ({ type: ADD_TODO, payload: removeAction.payload })),
  )
  const undoDelayed$ = merge(
    removeTodo$.pipe(mapTo('remove')),
    undo$.pipe(mapTo('undo')),
    delay$.pipe(mapTo('delay'))
  ).pipe(
    bufferWhen(() => delay$),
    sequenceEqual(from(['remove', 'delay'])),
    filter(ev => true),
    withLatestFrom(state$),
    tap(([, state]) => syncLocalStorage(state.todoList.todos)),
    mapTo({ type: SHOW_UNDO_BUTTON, payload: false }),
  )

  return merge(undoRemove$, undoDelayed$)
}

const addTodoEpic = (action$, state$) => action$
  .pipe(
    filter(action => action.type === ADD_TODO && !action.payload),
    bufferCount(3),
    withLatestFrom(state$),
    tap(([, state]) => syncLocalStorage(state.todoList.todos)),
    mapTo({ type: SHOW_CONGRATULATION })
  )

function syncLocalStorage(todos) {
  localStorage.setItem('todos', todos.join(','))
}

export const todoListEpic = combineEpics(addTodoEpic, removeTodoEpic, undoRemoveEpic, undoDelayEpic)

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