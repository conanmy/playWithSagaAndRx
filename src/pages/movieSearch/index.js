import React from 'react'
import { connect } from 'react-redux'
import { changeParam } from './store'

function mapStateToProps(state) {
  const { dataSource: { data: movies } } = state.movieSearch
  return {
    movies,
  }
}

const mapDispatchToProps = {
  changeParam,
}

function MovieSearch(props) {
  const {
    movies,
    changeParam
  } = props
  return (
    <div>
      <div>
        <p>尝试搜索电影吧</p>
        <select onChange={e => changeParam({ key: 'language', value: e.target.value })}>
          <option value="">select</option>
          <option value="zh">Chinese</option>
          <option value="de">Deutsch</option>
          <option value="ja">Japanese</option>
        </select>
        <select onChange={e => changeParam({ key: 'year', value: e.target.value })}>
          <option value="">select</option>
          <option value="2019">2019</option>
          <option value="2018">2018</option>
          <option value="2017">2017</option>
          <option value="2016">2016</option>
        </select>
        <input onChange={e => changeParam({ key: 'query', value: e.target.value })} />
      </div>
      <div>
        {
          movies.map(movie => <p>{movie.title}</p>)
        }
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MovieSearch)