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

describe('Conditional', () => {
  it('should render truthy/falsy IF', () => {
    const creamy = new Creamy()

    creamy.parse(`
    <div @name="item">
      <div @if="{details}">{details}</div>
    </div>

    <div @name="message" @if="{show}">
      <div>{details}</div>
    </div>
  `)

    expect(
      creamy.render(`
    <Message show="true" details="hello" />
  `)
    ).toMatchInlineSnapshot(`
      "
          <div>
            <div>hello</div>
          </div>
        "
    `)

    expect(
      creamy.render(`
    <Message show="false" details="hello" />
  `)
    ).toMatchInlineSnapshot(`
      "
          
        "
    `)

    expect(
      creamy.render(`
    <Item details="hello" />
  `)
    ).toMatchInlineSnapshot(`
    "
        <div>
          <div>hello</div>
        </div>
      "
  `)

    expect(
      creamy.render(`
    <Item details="0" />
  `)
    ).toMatchInlineSnapshot(`
      "
          <div>
            
          </div>
        "
    `)

    expect(
      creamy.render(`
    <Item details="" />
  `)
    ).toMatchInlineSnapshot(`
      "
          <div>
            
          </div>
        "
    `)
  })

  it('should render comparison string', () => {
    const creamy = new Creamy()

    creamy.parse(`
    <div @name="item">
      <div @if="{language}==en">Hello, {language}</div>
    </div>
  `)

    expect(
      creamy.render(`
    <Item language="en" />
  `)
    ).toMatchInlineSnapshot(`
    "
        <div>
          <div>Hello, en</div>
        </div>
      "
  `)

    expect(
      creamy.render(`
    <Item language="ja" />
  `)
    ).toMatchInlineSnapshot(`
      "
          <div>
            
          </div>
        "
    `)
  })
})
