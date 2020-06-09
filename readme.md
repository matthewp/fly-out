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

## Customize

### Content

The content for the fly-out button can be provided 2 ways. The first is to use the `button` slot. The following shows this usage:

```html
<fly-out class="user-menu" caret align="right">
  <img slot="button" alt="@person" src="https://example.com/some-image.png" height="20" width="20">
  <ul slot="menu" class="menu">
    <li><a href="#">Item 1</a></li>
    <li><a href="#">Item 2</a></li>
  </ul>
</fly-out>
```

As shown above, when you want to customize the button contents you need to add 2 named slots:

* `slot=button`: Used to set the contents of the button.
* `slot=menu`: Used to set the contents of the (initially) hidden menu.

If all you need is text you can use the __label__ attribute, in which case no named slots are necessary:

```html
<fly-out label="Menu">
  <ul>
    <li><a href="/home">Homepage</a></li>
    <li><a href="/cart">Cart</a></li>
    <li><a href="/shoes">Shoes</a></li>
  </ul>
</fly-out>
```

### Alignment

By default the dropdown will be aligned to the *left* of the button. If you would like it to be aligned to the right, such as if your button is all the way to the right end of the screen, use the `align` attribute:

```html
<fly-out label="Menu" align="right">
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</fly-out>
```

### Styling

The `<button>` that the fly-out menu displays can be styled as a `part::(button)` like so:

```css
fly-out::part(button) {
  background-color: #f4511e;
  font-size: 1em;
  padding: 12px 16px;
  color: white;
}
```

When the menu is open a boolean `open` attribute is added to the element. This can be used to customize any of the above values while the menu is open. For example:

```css
fly-out[open]::part(button) {
  background-color: grey;
}
```

## License

[BSD 2 Clause](https://opensource.org/licenses/BSD-2-Clause)