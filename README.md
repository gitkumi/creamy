# Creamy

A minimalistic component-based templating engine.

## Usage

```ts
const creamy = new Creamy()

// Load the Navbar component.
creamy.parse('<div @name="navbar">Navbar</div>')

// Render Navbar component to a template.
creamy.render('<html><Navbar/></html>')
```

## Directives

- `@name`
  Creates a component. `@name` is required for all components.

```html
// component.html
<div @name="container">{children}</div>

// you can create multiple component in single file.
<button
  class=""
  @name="app-button"
>
  {children}
</button>
```

then in your template.

```html
<Container>
  <AppButton> Submit </AppButton>
</Container>
```

- `@if`  
  Conditionally render a node.

```html
// component.html
<div
  @name="user"
  @if="name"
>
  <div>{name}</div>
</div>
```

then in your template.

```html
<User name="Ada" />
```

## Use as a Vite plugin

```ts
// vite.config.ts
function creamyLoader() {
  return {
    name: 'creamyLoader',
    transformIndexHtml(html: string) {
      const creamy = new Creamy()

      const templates = globSync(
        resolve(__dirname, '../src/components/**.html')
      )

      for (let template of templates) {
        const content = readFileSync(template, 'utf8')
        creamy.parse(content)
      }

      return creamy.render(html)
    },
  }
}

export default defineConfig({
  plugins: [creamyLoader()],
})
```
