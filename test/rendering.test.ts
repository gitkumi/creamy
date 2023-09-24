import { describe, expect, it } from 'vitest'
import { Creamy, sanitizeString } from '../src'

describe('sanitizeString', () => {
  it('should sanitize "&" character', () => {
    expect(sanitizeString('&')).toBe('&amp;')
  })

  it('should sanitize "<" character', () => {
    expect(sanitizeString('<')).toBe('&lt;')
  })

  it('should sanitize ">" character', () => {
    expect(sanitizeString('>')).toBe('&gt;')
  })

  it('should sanitize double-quote (") character', () => {
    expect(sanitizeString('"')).toBe('&quot;')
  })

  it("should sanitize single-quote (') character", () => {
    expect(sanitizeString("'")).toBe('&#x27')
  })

  it('should sanitize forward slash (/) character', () => {
    expect(sanitizeString('/')).toBe('&#x2F')
  })

  it('should sanitize special characters in a string', () => {
    expect(sanitizeString('<div>Hello, "World" & \'Universe\'</div>')).toBe(
      '&lt;div&gt;Hello, &quot;World&quot; &amp; &#x27Universe&#x27&lt;&#x2Fdiv&gt;'
    )
  })

  it('should prevent XXS', () => {
    expect(sanitizeString("<script>alert('xss')</script>")).toBe(
      '&lt;script&gt;alert(&#x27xss&#x27)&lt;&#x2Fscript&gt;'
    )
  })

  it('should not modify a string without special characters', () => {
    expect(sanitizeString('This is a plain text.')).toBe(
      'This is a plain text.'
    )
  })
})

describe('Rendering', () => {
  it('should render components', () => {
    const creamy = new Creamy()
    creamy.parse(`
    <div @name="one">1</div>
    <div @name="two">2</div>
    <div @name="three">3</div>
  `)

    const rendered = creamy.render(`
    <One/><Two/><Three/>
  `)

    expect(rendered).toMatchInlineSnapshot(
      '"<div>1</div><div>2</div><div>3</div>"'
    )
  })

  it('should render components with props', () => {
    const creamy = new Creamy()
    creamy.parse(`
    <div @name="one">{greetings}</div>
  `)

    expect(
      creamy.render(`
    <One greetings="hello" />
  `)
    ).toMatchInlineSnapshot('"<div>hello</div>"')
  })

  it.todo('it should dangerously render components with props', () => {})

  it('it should escape characters', () => {
    const creamy = new Creamy()
    creamy.parse(`
    <div @name="one">{greetings}</div>
  `)

    expect(
      creamy.render(`
    <One greetings="<div>No XSS</div>" />
  `)
    ).toMatchInlineSnapshot('"<div><div>No XSS</div></div>"')
  })

  it('should remove empty tags', () => {
    const creamy = new Creamy()
    creamy.parse(`
    <div @name="one">{unknown}</div>
  `)

    expect(
      creamy.render(`
    <One greetings="hello" />
  `)
    ).toMatchInlineSnapshot('"<div></div>"')
  })

  it('should render children text', () => {
    const creamy = new Creamy()
    creamy.parse(`
    <div @name="one">{children}</div>
  `)

    expect(
      creamy.render(`
    <One>Children rendered</One>
  `)
    ).toMatchInlineSnapshot('"<div>Children rendered</div>"')
  })

  it('should render children components', () => {
    const creamy = new Creamy()
    creamy.parse(`
    <div @name="parent">{children}</div>
    <div @name="child">Child</div>
  `)

    expect(
      creamy.render(`
    <Parent><Child/></Parent>
  `)
    ).toMatchInlineSnapshot('"<div><div>Child</div></div>"')
  })

  it.todo('it should dangerously render children components', () => {})
})
