import { parse as parseNodes, Node, HTMLElement } from 'node-html-parser'

export class Creamy {
  components: Map<string, HTMLElement>

  constructor() {
    this.components = new Map()
  }

  parse(source: string) {
    const parsed = parseNodes(source)

    const traverse = (node: Node | HTMLElement) => {
      if (node instanceof HTMLElement && node.nodeType == 1) {
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

  private renderConditional(node: HTMLElement) {
    // const hasElseIf = '@else-if' in node.attributes

    // if (hasElseIf) {
    //   throw new Error('else if is not valid.')
    // }

    // const hasElse = '@else' in node.attributes

    // if (hasElse) {
    //   throw new Error('else is not valid.')
    // }

    const hasIf = '@if' in node.attributes

    if (!hasIf) {
      return
    }

    const show = evaluateExpression(node.attributes['@if'])
    node.removeAttribute('@if')

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
      hideNextElses(node)
      return
    }

    for (;;) {
      const nextNode = node.nextElementSibling

      if (!nextNode) {
        node.remove()
        break
      }

      const hasElse = '@else' in nextNode.attributes

      if (hasElse) {
        nextNode.removeAttribute('@else')
        node.remove()
        break
      }

      const hasElseIf = nextNode.attributes['@else-if']
      const show = evaluateExpression(hasElseIf)

      if (show) {
        nextNode.removeAttribute('@else-if')
        node.remove()
        hideNextElses(nextNode)
        break
      }

      if (!hasElse && !hasElseIf) {
        node.remove()
        break
      }

      nextNode.remove()
    }
  }

  private renderComponent(node: HTMLElement, component: HTMLElement) {
    component.removeAttribute('@name')

    const withProps = component.toString().replaceAll(/{[^}]+}/g, match => {
      if (match === '{children}') {
        return node.innerHTML
      }

      const attributeName = match.replaceAll('{', '').replaceAll('}', '')

      return node.attributes[attributeName] || ''
    })

    const withChildren = this.render(withProps)
    node.replaceWith(withChildren)
  }

  private stringToComponentKey(string: string) {
    return string.toLowerCase().replaceAll(/[^\dA-Za-z]/g, '')
  }
}

export function evaluateExpression(string: string) {
  if (!string) {
    return false
  }

  const operators = ['<=', '<', '>=', '>', '!==', '!=', '===', '==']

  const operator = operators.find(o => {
    return string.includes(o)
  })

  if (!operator) {
    if (string === '0') {
      return false
    }

    if (string === 'false') {
      return false
    }

    return true
  }

  const [leftOperand, rightOperand] = string.split(operator)
  const trimmedLeftOperand = leftOperand.trim()
  const trimmedRightOperand = rightOperand.trim()

  if (operator === '===') {
    return trimmedLeftOperand === trimmedRightOperand
  }

  if (operator === '!==') {
    return trimmedLeftOperand !== trimmedRightOperand
  }

  if (operator === '==') {
    return trimmedLeftOperand == trimmedRightOperand
  }

  if (operator === '!=') {
    return trimmedLeftOperand != trimmedRightOperand
  }

  if (
    Number.isNaN(Number(trimmedLeftOperand)) ||
    Number.isNaN(Number(trimmedRightOperand))
  ) {
    return false
  }

  const numLeftOperand = Number.parseFloat(trimmedLeftOperand)
  const numRightOperand = Number.parseFloat(trimmedRightOperand)

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
