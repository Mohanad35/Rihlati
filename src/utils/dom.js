/**
 * Return an element that must exist for the application to start.
 * Keeping this assertion at the boundary prevents silent null failures later.
 */
export function requireElement(selector, scope = document) {
  const element = scope.querySelector(selector)

  if (!(element instanceof Element)) {
    throw new Error(`Required element was not found: ${selector}`)
  }

  return element
}

/** Remove all child nodes from an element. */
export function clearElement(element) {
  element.replaceChildren()
}

/**
 * Small DOM factory for static structure. It intentionally does not implement
 * event binding, diffing, state, templates, or any virtual-DOM behavior.
 */
export function createElement(
  tagName,
  { className = '', text = '', attributes = {}, children = [] } = {},
) {
  const element = document.createElement(tagName)

  if (className) {
    element.className = className
  }

  if (text) {
    element.textContent = text
  }

  for (const [name, value] of Object.entries(attributes)) {
    if (value !== undefined && value !== null && value !== false) {
      element.setAttribute(name, value === true ? '' : String(value))
    }
  }

  for (const child of children) {
    element.append(child instanceof Node ? child : document.createTextNode(String(child)))
  }

  return element
}
