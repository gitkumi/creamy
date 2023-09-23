import { expect, it } from 'vitest'
import { Creamy } from '../src/creamy'
import { resolve } from 'path'

it('should add components', () => {
  const creamy = new Creamy()
  creamy.addComponent(`
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

it('should add components from files', async () => {
  const creamy = new Creamy()
  await creamy.addComponentFromFiles([resolve(__dirname, 'test.html')])

  expect(creamy.components).toMatchInlineSnapshot(`
    Map {
      "test" => <div>
        TextNode {
          "_rawText": "Test component",
          "childNodes": [],
          "nodeType": 3,
          "parentNode": <div>
            [Circular]
          </div>,
        }
      </div>,
      "item" => <div>
        TextNode {
          "_rawText": "Item component",
          "childNodes": [],
          "nodeType": 3,
          "parentNode": <div>
            [Circular]
          </div>,
        }
      </div>,
      "foo" => <div>
        TextNode {
          "_rawText": "Foo component",
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
