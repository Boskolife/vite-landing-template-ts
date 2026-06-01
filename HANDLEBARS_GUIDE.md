# Handlebars guide (this template)

This project uses Handlebars via `vite-plugin-handlebars` to render static HTML during dev/build.

## Where templates live

- `src/index.html`: the main page entry.
- `src/*.html`: any additional pages (multi-page app).
- `src/templates/*`: partials (shared building blocks like header/footer/button).
- `src/sections/*`: section partials (reusable page blocks).
- `src/data/site.json`: global data (available as `site` in every page).
- `src/data/<page>.json`: per-page data (available as `page` for `/<page>.html`).

## How data is injected

Vite renders each `src/*.html` through Handlebars. This template provides:

- `site`: always loaded from `src/data/site.json`
- `page`: automatically mapped from page name:
  - `src/pricing.html` → `src/data/pricing.json`
  - `src/about.html` → `src/data/about.json`
  - `src/index.html` → `{}` (no per-page file required)

In templates:

```hbs
<title>{{site.title}}</title>
<h1>{{page.headline}}</h1>
```

## Adding a new page + JSON (recommended workflow)

1) Create a page, for example `src/contact.html`
2) Create data file `src/data/contact.json`
3) Use `page` inside `contact.html`:

```hbs
<title>{{page.meta.title}} · {{site.brand}}</title>
{{#if page.content}}
  <p>{{page.content}}</p>
{{/if}}
```

No config changes are required as long as the names match.

## Partials (reusable blocks)

Partials are files in `src/templates` or `src/sections`. They are included like this:

```hbs
{{> header}}
{{> section-hero}}
{{> footer}}
```

### Passing parameters to partials

You can pass named arguments:

```hbs
{{> button label="Download" href="/download" variant="primary"}}
```

Inside the partial (`src/templates/button.html`) those values are available by name:

```hbs
<a class="hero__btn hero__btn--{{variant}}" href="{{href}}">
  {{label}}
</a>
```

## Core Handlebars expressions

### Variables and paths

```hbs
{{site.brand}}
{{page.meta.title}}
```

### `if` / `else`

```hbs
{{#if page.notice}}
  <div class="notice">{{page.notice}}</div>
{{else}}
  <div class="notice notice--hidden"></div>
{{/if}}
```

### `each` (arrays)

```hbs
{{#each site.nav}}
  <a href="{{href}}">{{label}}</a>
{{/each}}
```

Useful built-ins inside `each`:

- `this`: current item
- `@index`: item index (0..n)
- `@key`: when iterating objects

### Guarding empty arrays

To avoid rendering an empty `<ul>`:

```hbs
{{#if page.items.length}}
  <ul>
    {{#each page.items}}
      <li>{{this}}</li>
    {{/each}}
  </ul>
{{/if}}
```

### `with` (change the current context)

```hbs
{{#with site.hero}}
  {{#if title}}<h1>{{title}}</h1>{{/if}}
  {{#if text}}<p>{{text}}</p>{{/if}}
{{/with}}
```

## Helpers in this template

Helpers are functions available in templates. They are configured in `vite.config.ts`.

### `year`

Returns current year as a string:

```hbs
<small>© {{year}} {{site.brand}}</small>
```

### `upper`

Uppercases a value:

```hbs
<h2>{{upper site.features.title}}</h2>
```

### `picture`

Generates a `<picture>` with WebP source and an `<img>` fallback.

Common usage:

```hbs
{{picture "/images/hero.jpg" alt="Hero" class="hero-image" loading="lazy"}}
```

Notes:

- Prefer passing `alt=` explicitly.
- The `src` can start with `/` (the helper normalizes it for output).

### `array`

Collects passed arguments into an array (useful together with other helpers/partials):

```hbs
{{#each (array "One" "Two" "Three")}}
  <span>{{this}}</span>
{{/each}}
```

### `object`

Builds an object from hash parameters:

```hbs
{{#with (object title="Hello" text="World")}}
  <h2>{{title}}</h2>
  <p>{{text}}</p>
{{/with}}
```

## JSON authoring tips (important)

- JSON keys should avoid characters that make template access awkward.
  - Prefer `text2` over `text-2` so you can write `{{site.hero.text2}}`.
- Keep strings empty (`""`) instead of removing keys if you want stable template shape.
- Use arrays for lists even if you start with an empty list (`[]`).

## Formatting Handlebars blocks (Prettier)

This project uses `@poliklot/prettier-plugin-handlebars` so `{{#if}}`, `{{/if}}`, `{{#each}}`, and partials stay on separate lines instead of being glued together.

Configured in `.prettierrc` for `src/**/*.html` with `parser: "handlebars"`.

Format on save (already enabled in `.vscode/settings.json`) or run:

```sh
npm run format
```

Handlebars HTML uses **double quotes** for attributes (`class="..."`) via `singleQuote: false` in the Prettier override for `src/**/*.html`.

Example output:

```hbs
{{#if site.hero.title}}
  <h1 class="hero__title">{{site.hero.title}}</h1>
{{/if}}
{{#if site.hero.text}}
  <p class="hero__text">{{site.hero.text}}</p>
{{/if}}
```

## Reload behavior (dev)

The dev server is configured to full-reload the page when files change in:

- `src/templates/`
- `src/sections/`
- `src/data/`

If you change `vite.config.ts`, Vite will restart the server automatically.

