# Creamy

A minimalistic component-based HTML templating engine.

## Installation

```sh
pnpm add -D @gitkumi/creamy
```

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
<button @name="app-button">
  {children}
</button>
```

then in your template.

```html
<Container>
  <AppButton> Submit </AppButton>
</Container>
```

- `@if` / `@else-if` / `@else`
  Conditionally render a node.

```html
// component.html
<div @name="ranking">
  <div @if="{rank}==1">First</div>
  <div @else-if="{rank}==2">Second</div>
  <div @else-if="{rank}==3">Third</div>
  <div @else-if="{rank}==4">Fourth</div>
  <div @else-if="{rank}==5">Fifth</div>
  <div @else>??</div>
</div>
```

then in your template.

```html
<Ranking rank="1" />
```

## Props

You can add props to a component by wrapping a text with `{}`
```html
// component
<div @name="greetings">
  Hello, {name}!
</div>

// template
<Greetings name="Ada" />
```

`{children}` is a special prop that you can use to pass the entire content of the element.
```html
// component
<div @name="container">{children}</div>

// template
<Container>
  <div>Lorem ipsum</div>
  <div>Lorem ipsum</div>
  <div>Lorem ipsum</div>
</Container>
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
