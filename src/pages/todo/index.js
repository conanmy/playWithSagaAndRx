import React from 'react'
import { connect } from 'react-redux'
import { addTodo, removeTodo, undoRemove, changeInput } from './store'

function mapStateToProps(state) {
  const { todos, todo, showCongratulation, showUndoButton } = state.todoList
  return {
    todos,
    todo,
    showCongratulation,
    showUndoButton,
  }
}

const mapDispatchToProps = {
  addTodo,
  changeInput,
  removeTodo,
  undoRemove,
}

function TodoList(props) {
  const {
    todos, todo, showCongratulation, showUndoButton,
    addTodo, removeTodo, undoRemove, changeInput
  } = props
  return (
    <div>
      <div>
      {
        todos.map(todo => <p>
          {todo}<button onClick={() => removeTodo(todo)}>Delete</button>
        </p>)
      }
      </div>
      <div>
        {
          showUndoButton
          ? <button onClick={() => undoRemove()}>Undo</button>
          : null
        }
      </div>
      <div>
        <input
          placeholder="添加待办事项"
          value={todo}
          onChange={
            e => changeInput(e.target.value)
          }
          onKeyDown={e => {
            if (e.which === 13) {
              addTodo()
            }
          }}
        />
      </div>
      <p>
      {
        showCongratulation ? '恭喜你，完成训练' : ''
      }
      </p>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoList)