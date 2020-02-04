import React, { useEffect } from 'react'
import { fromEvent } from 'rxjs'
import { debounceTime, bufferWhen, map } from 'rxjs/operators'
import _ from 'lodash'

const EASTER_EGG_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
  "KeyB",
  "KeyA"
]

export default function EasterEgg() {
  useEffect(() => {
    const keys = fromEvent(document, 'keyup')
    keys
      .pipe(
        map(e => e.code),
        bufferWhen(() => keys.pipe(debounceTime(1000)))
      )
      .subscribe(serialkeys => {
        if (_.isEqual(serialkeys, EASTER_EGG_CODE)) {
          window.alert('恭喜你，找到彩蛋啦！')
        }
      })
  })
  return (
    <div>
      用键盘探索彩蛋吧~
    </div>
  )
}