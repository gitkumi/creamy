import { expect, it } from 'vitest'
import { Creamy } from '../src'

it('should add components', () => {
  const creamy = new Creamy()
  creamy.parse(`
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
