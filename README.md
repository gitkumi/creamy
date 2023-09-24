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
// components.html
<div @name="container">{children}</div>

// you can create multiple component in single file.
<button @name="button">{children}</button>

// index.html
<Container>
  <Button>Submit</Button>
</Container>
```

To prevent conflict with normal HTML tags, component usage should be `PascalCase`.

```html
// components.html
<div @name="button">{children}</div>
<div @name="app-button">{children}</div>

//index.html
<Button>Custom Button</Button>
<AppButton>Custom Button</AppButton>
```

- `@if` / `@else-if` / `@else`
  Conditionally render a node.

```html
// components.html
<div @name="ranking">
  <div @if="{rank}==1">First</div>
  <div @else-if="{rank}==2">Second</div>
  <div @else-if="{rank}==3">Third</div>
  <div @else-if="{rank}==4">Fourth</div>
  <div @else-if="{rank}==5">Fifth</div>
  <div @else>??</div>
</div>

// index.html
<Ranking rank="1" />
```

## Props

You can add props to a component by wrapping a string with `{}`

```html
// components.html
<div @name="greetings">Hello, {name}!</div>

// index.html
<Greetings name="Ada" />
```

All props are sanitized by default. If you need to show a prop as is, add a `!` to the prop name.

```html
// components.html
<div @name="greetings">Hello, {name}! {icon!}</div>

// index.html
<Greetings name="Ada" icon={<svg></svg>} />
```

`{children}` is a special prop that you can use to pass the entire content of the element.  
Note that `{children}` will be rendered unsanitized.

```html
// components.html
<div @name="container">{children}</div>

// index.html
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
