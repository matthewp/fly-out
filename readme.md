# &lt;fly-out&gt;

A fly-out (aka drop-down) menu with the following features:

* Written in light-weight plain JavaScript; no framework dependencies.
* Accessibility is a primary goal.

## Usage / Install

Use directly from unpkg:

```html
<fly-out label="Menu">
  <ul>
    <li><a href="/home">Homepage</a></li>
    <li><a href="/cart">Cart</a></li>
    <li><a href="/shoes">Shoes</a></li>
  </ul>
</fly-out>

<script type="module" src="https://unpkg.com/@matthewp/fly-out/fly-out.js"></script>
```

## Styling

The `<button>` that the fly-out menu displays can be styled by providing the following CSS variables:

```css
fly-out {
  --button-background-color: #f4511e;
  --button-font-size: 1em;
  --button-padding: 12px 16px;
  --button-color: white;
}
```

When the menu is open a boolean `open` attribute is added to the element. This can be used to customize any of the above values while the menu is open. For example:

```css
fly-out[open] {
  --button-background-color: grey;
}
```

## License

[BSD 2 Clause](https://opensource.org/licenses/BSD-2-Clause)