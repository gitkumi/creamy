import { parse, Node, HTMLElement } from 'node-html-parser'

export class Creamy {
  components: Map<string, HTMLElement>

  constructor() {
    this.components = new Map()
  }

  addComponentFromFiles(files: []) {}

  addComponent(source: string) {
    const parsed = parse(source)

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
    const parsed = parse(template)

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

    return parsed.toString()
  }

  private renderConditional(node: HTMLElement) {
    const hasIf = '@if' in node.attributes

    if (!hasIf) {
      return
    }

    const traverse = (node: Node | HTMLElement) => {
      if (node instanceof HTMLElement) {
        const shouldShow = evaluateExpression(node.attributes['@if'])
        if (!shouldShow) {
          node.remove()
        }
        node.removeAttribute('@if')
      }

      for (const child of node.childNodes) {
        traverse(child)
      }
    }

    traverse(node)
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
  if (string.length <= 0) {
    return false
  }

  const operators = ['<=', '<', '>=', '>', '!==', '!=', '===', '==']

  const operator = operators.find(o => {
    return string.includes(o)
  })

  if (!operator) {
    // Retain this JS behavior
    return string === '0' ? false : true
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
