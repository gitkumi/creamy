import { describe, expect, it } from 'vitest'
import { Creamy, toPascalCase } from '../src'

describe('toPascalCase', () => {
  it('should return a pascal cased string', () => {
    expect(toPascalCase('app-button')).toBe('AppButton')
    expect(toPascalCase('appbutton')).toBe('Appbutton')
    expect(toPascalCase('Navbar')).toBe('Navbar')
    expect(toPascalCase('foo bar')).toBe('FooBar')
    expect(toPascalCase('Foo Bar')).toBe('FooBar')
    expect(toPascalCase('fooBar')).toBe('FooBar')
    expect(toPascalCase('FooBar')).toBe('FooBar')
    expect(toPascalCase('foo-bar')).toBe('FooBar')
    expect(toPascalCase('foo_bar')).toBe('FooBar')
    expect(toPascalCase('--foo-bar--')).toBe('FooBar')
    expect(toPascalCase('__FOO_BAR__')).toBe('FooBar')
    expect(toPascalCase('!--foo-¿?-bar--121-*')).toBe('FooBar121')
    expect(toPascalCase('Here i am')).toBe('HereIAm')
    expect(toPascalCase('FOO BAR')).toBe('FooBar')
  })
})

describe('Parsing', () => {
  it('should parse components', () => {
    const creamy = new Creamy()
    creamy.parse(`
    <div @name="one">1</div>
    <div @name="two">2</div>
    <div @name="three">3</div>
  `)

    expect(creamy.components).toMatchInlineSnapshot(`
    Map {
      "One" => <div>
        TextNode {
          "_rawText": "1",
          "childNodes": [],
          "nodeType": 3,
          "parentNode": <div>
            [Circular]
          </div>,
        }
      </div>,
      "Two" => <div>
        TextNode {
          "_rawText": "2",
          "childNodes": [],
          "nodeType": 3,
          "parentNode": <div>
            [Circular]
          </div>,
        }
      </div>,
      "Three" => <div>
        TextNode {
          "_rawText": "3",
          "childNodes": [],
          "nodeType": 3,
          "parentNode": <div>
            [Circular]
          </div>,
        }
      </div>,
    }
  `)
  })
})
