import { expect, it } from "vitest"
import { Creamy } from "../src/creamy"

it("should load components", () => {
  const creamy = new Creamy(`
    <div @name="one">1</div>
    <div @name="two">2</div>
    <div @name="three">3</div>
  `)

  expect(creamy.components).toMatchInlineSnapshot(`
    Map {
      "one" => <div>
        TextNode {
          "_rawText": "1",
          "childNodes": [],
          "nodeType": 3,
          "parentNode": <div>
            [Circular]
          </div>,
        }
      </div>,
      "two" => <div>
        TextNode {
          "_rawText": "2",
          "childNodes": [],
          "nodeType": 3,
          "parentNode": <div>
            [Circular]
          </div>,
        }
      </div>,
      "three" => <div>
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

it("should render components", () => {
  const creamy = new Creamy(`
    <div @name="one">1</div>
    <div @name="two">2</div>
    <div @name="three">3</div>
  `)

  const rendered = creamy.render(`
    <One/><Two/><Three/>
  `)

  expect(rendered).toMatchInlineSnapshot(`
    "
        <div>1</div><div>2</div><div>3</div>
      "
  `)
})

it("should render components with props", () => {
  const creamy = new Creamy(`
    <div @name="one">{greetings}</div>
  `)

  expect(
    creamy.render(`
    <One greetings="hello" />
  `)
  ).toMatchInlineSnapshot(`
    "
        <div>hello</div>
      "
  `)
})

it.todo("it should dangerously render components with props", () => {})

it.todo("it should escape characters", () => {
  const creamy = new Creamy(`
    <div @name="one">{greetings}</div>
  `)

  expect(
    creamy.render(`
    <One greetings="<div>No XSS</div>" />
  `)
  ).toMatchInlineSnapshot(`
    "
        <div>hello</div>
      "
  `)
})

it("should remove empty tags", () => {
  const creamy = new Creamy(`
    <div @name="one">{unknown}</div>
  `)

  expect(
    creamy.render(`
    <One greetings="hello" />
  `)
  ).toMatchInlineSnapshot(`
    "
        <div></div>
      "
  `)
})

it("should render children text", () => {
  const creamy = new Creamy(`
    <div @name="one">{children}</div>
  `)

  expect(
    creamy.render(`
    <One>Children rendered</One>
  `)
  ).toMatchInlineSnapshot(`
    "
        <div>Children rendered</div>
      "
  `)
})

it("should render children components", () => {
  const creamy = new Creamy(`
    <div @name="parent">{children}</div>
    <div @name="child">Child</div>
  `)

  expect(
    creamy.render(`
    <Parent><Child/></Parent>
  `)
  ).toMatchInlineSnapshot(`
    "
        <div><div>Child</div></div>
      "
  `)
})

it.todo("it should dangerously render children components", () => {})
