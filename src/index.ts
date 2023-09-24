import { parse as parseNodes, Node, HTMLElement } from 'node-html-parser'

export class Creamy {
  components: Map<string, HTMLElement>

  constructor() {
    this.components = new Map()
  }

  parse(source: string) {
    const parsed = parseNodes(source)

    const traverse = (node: Node | HTMLElement) => {
      if (node instanceof HTMLElement && node.tagName) {
        const name = node.attributes['@name'] as string

        if (name) {
          const key = this.stringToComponentKey(name)
          this.components.set(key, node)
        }
      }

      for (const child of node.childNodes) {
        traverse(child)
      }
    }

    traverse(parsed)
  }

  render(template: string) {
    const parsed = parseNodes(template)

    const traverse = (node: Node | HTMLElement) => {
      if (node instanceof HTMLElement && node.tagName) {
        const key = this.stringToComponentKey(node.tagName)
        const component = this.components.get(key)

        if (component) {
          // Node will be replaced by component
          this.renderComponent(node, component)
        }

        this.renderConditional(node)
      }

      for (const child of node.childNodes) {
        traverse(child)
      }
    }

    traverse(parsed)

    return parsed.removeWhitespace().toString()
  }

  private renderConditional(element: HTMLElement) {
    const hasElseIf = '@else-if' in element.attributes

    // 'else'/'else-if' gets processed together with if.
    // processed 'else' gets detached from the DOM via node.remove()
    // so if an 'else' node still have a parentNode,
    // an 'if' node was not processed beforehand so we throw an error.
    if (element.parentNode && hasElseIf) {
      throw new Error('@else-if is not valid.')
    }

    const hasElse = '@else' in element.attributes

    if (element.parentNode && hasElse) {
      throw new Error('@else is not valid.')
    }

    const hasIf = '@if' in element.attributes

    if (!hasIf) {
      return
    }

    const show = evaluateExpression(element.attributes['@if'])
    element.removeAttribute('@if')

    const hideNextElses = (node: HTMLElement) => {
      const nextNode = node.nextElementSibling

      if (nextNode) {
        const hasElse = '@else' in nextNode.attributes
        const hasElseIf = nextNode.attributes['@else-if']

        if (hasElse || hasElseIf) {
          nextNode.remove()
          hideNextElses(node)
        }
      }
    }

    if (show) {
      hideNextElses(element)
      return
    }

    for (;;) {
      const nextNode = element.nextElementSibling

      if (!nextNode) {
        element.remove()
        break
      }

      const hasElse = '@else' in nextNode.attributes

      if (hasElse) {
        nextNode.removeAttribute('@else')
        element.remove()
        break
      }

      const hasElseIf = nextNode.attributes['@else-if']
      const show = evaluateExpression(hasElseIf)

      if (show) {
        nextNode.removeAttribute('@else-if')
        element.remove()
        hideNextElses(nextNode)
        break
      }

      if (!hasElse && !hasElseIf) {
        element.remove()
        break
      }

      nextNode.remove()
    }
  }

  private renderComponent(element: HTMLElement, component: HTMLElement) {
    component.removeAttribute('@name')

    const withProps = component.toString().replaceAll(/{[^}]+}/g, match => {
      if (match === '{children}') {
        return element.innerHTML
      }

      const attributeName = match.replaceAll('{', '').replaceAll('}', '')

      return element.attributes[attributeName] || ''
    })

    const withChildren = this.render(withProps)
    element.replaceWith(withChildren)
  }

  private stringToComponentKey(string: string) {
    return string.toLowerCase().replaceAll(/[^\dA-Za-z]/g, '')
  }
}

export function evaluateExpression(string: string) {
  if (!string || string === '0' || string === 'false') {
    return false
  }

  const operators = ['<=', '<', '>=', '>', '!==', '!=', '===', '==']

  const operator = operators.find(o => {
    return string.includes(o)
  })

  if (!operator) {
    return true
  }

  const [leftOperand, rightOperand] = string.split(operator).map(s => s.trim())

  if (operator === '===') {
    return leftOperand === rightOperand
  }

  if (operator === '!==') {
    return leftOperand !== rightOperand
  }

  if (operator === '==') {
    return leftOperand == rightOperand
  }

  if (operator === '!=') {
    return leftOperand != rightOperand
  }

  if (Number.isNaN(Number(leftOperand)) || Number.isNaN(Number(rightOperand))) {
    return false
  }

  const numLeftOperand = Number.parseFloat(leftOperand)
  const numRightOperand = Number.parseFloat(rightOperand)

  switch (operator) {
    case '<':
      return numLeftOperand < numRightOperand
    case '<=':
      return numLeftOperand <= numRightOperand
    case '>':
      return numLeftOperand > numRightOperand
    case '>=':
      return numLeftOperand >= numRightOperand
    case '==':
      return numLeftOperand == numRightOperand
    case '!=':
      return numLeftOperand != numRightOperand
    default:
      return false
  }
}
