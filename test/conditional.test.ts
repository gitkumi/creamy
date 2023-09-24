import { describe, expect, it } from 'vitest'
import { Creamy, evaluateExpression } from '../src'

describe('evaluateExpression', () => {
  it('should return true for truthy values', () => {
    expect(evaluateExpression('true')).toBe(true)
    expect(evaluateExpression('hello')).toBe(true)
  })

  it('should return false for falsy values', () => {
    expect(evaluateExpression('false')).toBe(false)
    expect(evaluateExpression('0')).toBe(false)
    expect(evaluateExpression('')).toBe(false)
  })

  it('should return true for valid expressions (string)', () => {
    expect(evaluateExpression('hello == hello')).toBe(true)
    expect(evaluateExpression('hello === hello')).toBe(true)
    expect(evaluateExpression('hello != hola')).toBe(true)
    expect(evaluateExpression('hello !== hola')).toBe(true)
  })

  it('should return false for invalid expressions (string)', () => {
    expect(evaluateExpression('hello == hola')).toBe(false)
    expect(evaluateExpression('hello === hola')).toBe(false)
    expect(evaluateExpression('hello != hello')).toBe(false)
    expect(evaluateExpression('hello !== hello')).toBe(false)
  })

  it('should return true for valid expressions', () => {
    expect(evaluateExpression('1 < 2')).toBe(true)
    expect(evaluateExpression('2 <= 2')).toBe(true)
    expect(evaluateExpression('3 > 2')).toBe(true)
    expect(evaluateExpression('2 >= 2')).toBe(true)
    expect(evaluateExpression('1 == 1')).toBe(true)
    expect(evaluateExpression('1 === 1')).toBe(true)
    expect(evaluateExpression('1 != 2')).toBe(true)
    expect(evaluateExpression("1 !== '1'")).toBe(true)
  })

  it('should return false for invalid expressions', () => {
    expect(evaluateExpression('2 < 1')).toBe(false)
    expect(evaluateExpression('2 <= 1')).toBe(false)
    expect(evaluateExpression('2 > 3')).toBe(false)
    expect(evaluateExpression('2 >= 3')).toBe(false)
    expect(evaluateExpression('1 == 0')).toBe(false)
    expect(evaluateExpression("1 === '1'")).toBe(false)
    expect(evaluateExpression('1 != 1')).toBe(false)
    expect(evaluateExpression('1 !== 1')).toBe(false)
  })
})

describe('Conditional Rendering', () => {
  it('should render truthy', () => {
    const creamy = new Creamy()

    creamy.parse(`
    <div @name="item">
      <div @if="{details}">{details}</div>
    </div>

    <div @name="message" @if="{show}">
      <div>Details: {details}</div>
    </div>
  `)

    expect(
      creamy.render(`
      <Message show="true" details="hello" />
  `)
    ).toMatchInlineSnapshot('"<div><div>Details: hello</div></div>"')

    expect(
      creamy.render(`
    <Item details="hello" />
  `)
    ).toMatchInlineSnapshot('"<div><div>hello</div></div>"')
  })

  it('should not render falsy', () => {
    const creamy = new Creamy()

    creamy.parse(`
    <div @name="item">
      <div @if="{details}">{details}</div>
    </div>

    <div @name="message" @if="{show}">
      <div>Details: {details}</div>
    </div>
  `)

    expect(
      creamy.render(`
    <Message show="false" details="hello" />
  `)
    ).toMatchInlineSnapshot('""')

    expect(
      creamy.render(`
    <Item details="0" />
  `)
    ).toMatchInlineSnapshot('"<div></div>"')

    expect(
      creamy.render(`
    <Item details="false" />
  `)
    ).toMatchInlineSnapshot('"<div></div>"')

    expect(
      creamy.render(`
    <Item details="" />
  `)
    ).toMatchInlineSnapshot('"<div></div>"')
  })

  it('should render true comparison string result', () => {
    const creamy = new Creamy()

    creamy.parse(`
    <div @name="item" @if="{language}==en">
      <div>Hello, {language}</div>
    </div>
  `)

    expect(
      creamy.render(`
    <Item language="en" />
  `)
    ).toMatchInlineSnapshot('"<div><div>Hello, en</div></div>"')
  })

  it('should not render false string comparison result', () => {
    const creamy = new Creamy()

    creamy.parse(`
    <div @name="item" @if="{language}==en">
      <div>Hello, {language}</div>
    </div>
  `)

    expect(
      creamy.render(`
    <Item language="ja" />
  `)
    ).toMatchInlineSnapshot('""')
  })

  it('should render if and remove else', () => {
    const creamy = new Creamy()

    creamy.parse(`
    <div @name="ranking">
      <div @if="{rank}==1">First</div>
      <div @else-if="{rank}==2">Second</div>
      <div @else-if="{rank}==3">Third</div>
    </div>
  `)

    expect(
      creamy.render(`
    <Ranking rank="1" />
  `)
    ).toMatchInlineSnapshot('"<div><div>First</div></div>"')
  })

  it('should render else and remove if', () => {
    const creamy = new Creamy()

    creamy.parse(`
    <div @name="ranking">
      <div @if="{rank}==1">First</div>
      <div @else>Runner Up</div>
    </div>
  `)

    expect(
      creamy.render(`
    <Ranking rank="2" />
  `)
    ).toMatchInlineSnapshot('"<div><div>Runner Up</div></div>"')
  })

  it('should render else if and remove if and else', () => {
    const creamy = new Creamy()

    creamy.parse(`
    <div @name="ranking">
      <div @if="{rank}==1">First</div>
      <div @else-if="{rank}==2">Second</div>
      <div @else-if="{rank}==3">Third</div>
      <div @else-if="{rank}==4">Fourth</div>
      <div @else-if="{rank}==5">Fifth</div>
      <div @else>??</div>
    </div>
  `)

    expect(
      creamy.render(`
    <Ranking rank="4" />
  `)
    ).toMatchInlineSnapshot('"<div><div>Fourth</div></div>"')
  })

  it('should not remove unrelated node', () => {
    const creamy = new Creamy()

    creamy.parse(`
    <div @name="ranking">
      <div @if="{rank}==1">First</div>
      <div @else-if="{rank}==2">Second</div>
      <div @else-if="{rank}==3">Third</div>
      <div @else-if="{rank}==4">Fourth</div>
      <div @else-if="{rank}==5">Fifth</div>
      <div>Should not delete</div>
    </div>
  `)

    expect(
      creamy.render(`
    <Ranking rank="10" />
  `)
    ).toMatchInlineSnapshot('"<div><div>Should not delete</div></div>"')
  })
})
