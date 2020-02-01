import React from 'react'
import { connect } from 'react-redux'
import { addTodo, changeInput } from './store'

function mapStateToProps(state) {
  const { todos, todo, showCongratulation } = state.todoList
  return {
    todos,
    todo,
    showCongratulation,
  }
}

const mapDispatchToProps = {
  addTodo,
  changeInput,
}

function TodoList(props) {
  const { todos, todo, showCongratulation, addTodo, changeInput } = props
  return (
    <div>
      <div>
      {
        todos.map(todo => <p>{todo}</p>)
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