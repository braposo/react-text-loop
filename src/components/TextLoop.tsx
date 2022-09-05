import React, { useState, useRef, useEffect } from 'react'
import { animated, useTransition } from 'react-spring'
import cxs from 'cxs'
import { useRequestTimeout } from '../utils'

type Props = {
  children?: (JSX.Element | string)[]
  interval?: number | number[]
  delay?: number
  adjustingSpeed?: number
  springConfig?: {
    stiffness: number
    damping: number
  }
  fade?: boolean
  mask?: boolean
  noWrap?: boolean
  className?: string
  onChange?: Function
}

function TextLoop({
  children,
  interval = 3000,
  delay = 0,
  adjustingSpeed = 150,
  springConfig = { stiffness: 340, damping: 30 },
  fade = true,
  mask = false,
  noWrap = true,
  className = '',
  onChange,
}: Props) {
  const elements = React.Children.toArray(children) // TODO: useMemo this?

  const [state, setState] = useState({
    currentEl: elements[0],
    currentWordIndex: 0,
    wordCount: 0,
    usedDelay: false,
  })
  const wordBoxRef = useRef<HTMLDivElement | null>(null)
  // We set this state each time we get a new wordBoxRef in order to re-render immediately
  const [_, setWordBoxRefKey] = useState<string | null>(null)

  const currentInterval = Array.isArray(interval)
    ? interval[state.currentWordIndex % interval.length]
    : interval

  const currentItem = {
    el: state.currentEl,
    key: `step-${state.wordCount}`,
  }
  const transitions = useTransition([currentItem], {
    from: () => {
      // Fade in animation
      const { height } = getDimensions()
      return {
        opacity: getOpacity(),
        translate: height,
      }
    },
    enter: {
      // At rest values
      opacity: 1,
      translate: 0,
    },
    leave: () => {
      // Fade out animation
      const { height } = getDimensions()
      return {
        opacity: getOpacity(),
        translate: -height,
      }
    },
    config: springConfig,
    keys: (item) => item.key,
  })

  let nextTickInterval: number | null = state.usedDelay ? currentInterval : currentInterval + delay
  const needsTick = currentInterval > 0 && React.Children.count(children) > 1
  if (!needsTick) {
    nextTickInterval = null // Disable the timeout
  }

  // TODO: componentDidUpdate includes some code for currentInterval == 0 I think
  function tick() {
    const newWordIndex = (state.currentWordIndex + 1) % (children?.length ?? 0)
    const nextEl = elements[newWordIndex]

    const newState = {
      usedDelay: true, // Next tick won't have a delay
      currentWordIndex: newWordIndex,
      currentEl: nextEl,
      wordCount: (state.wordCount + 1) % 1000, // just a safe value to avoid infinite counts
    }
    setState(newState)

    if (onChange) {
      onChange(newState) // TODO: This used to be a different format
    }
  }
  useRequestTimeout(tick, nextTickInterval, state.wordCount)

  function getDimensions() {
    if (wordBoxRef.current == null) {
      return {
        width: 0,
        height: 0,
      }
    }
    return wordBoxRef.current.getBoundingClientRect()
  }

  function getOpacity(): 0 | 1 {
    return fade ? 0 : 1
  }

  const wrapperStyles = cxs({
    ...(mask && { overflow: 'hidden' }),
    ...{
      display: 'inline-block',
      position: 'relative',
      verticalAlign: 'top',
    },
  })

  const elementStyles = cxs({
    display: 'inline-block',
    left: 0,
    top: 0,
    whiteSpace: noWrap ? 'nowrap' : 'normal',
  })

  const { height, width } = getDimensions()
  const parsedWidth = wordBoxRef.current == null ? 'auto' : width
  const parsedHeight = wordBoxRef.current == null ? 'auto' : height

  return (
    <div className={`${wrapperStyles} ${className}`}>
      <div
        style={{
          transition: `width ${adjustingSpeed}ms linear`,
          height: parsedHeight,
          width: parsedWidth,
        }}>
        {transitions(({ opacity, translate }, item) => (
          <animated.div
            className={elementStyles}
            ref={(n) => {
              if (n && item.key === currentItem.key) {
                wordBoxRef.current = n
                setWordBoxRefKey(item.key)
              }
            }}
            style={{
              opacity: opacity,
              transform: translate.to((y) => `translateY(${y}px)`),
              position: wordBoxRef.current === null ? 'relative' : 'absolute',
            }}>
            {item.el}
          </animated.div>
        ))}
      </div>
    </div>
  )
}

export default TextLoop
