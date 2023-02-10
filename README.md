# Widgi JS

Widgi is a tiny (only 2kB) and optimized utility that allows you to build reactive web user interfaces without the need of preprocessors or bundlers (like Webpack or Babel) in modern browsers.

---

## Try it out!

```html
<!-- Old school minified script -->
<script src="https://raw.githubusercontent.com/doriandres/widgi/main/lib/widgi.min.js"></script>

<!-- Or as a module -->
<script type="module" src="https://raw.githubusercontent.com/doriandres/widgi/main/lib/widgi.module.js"></script>
```

---

## Counter widget example
The following example builds a simple and interactive widget
```js
function CounterWidget($) {
  var counter = $.use(0)
  const increase = $.fn(() => {
    counter(c => c + 1)
  })

  $.t("Value: ", counter)
  $.h('br')
  $.h('button', { onclick: increase }, $ => {
    $.t("Click me")
  })
}

$(document.getElementById('root'), CounterWidget)
```
### Generated HTML
```html
<div id="root">
    Value: 0
    <br/>
    <button>
        Click me
    </button>
<div>
```

---

## Loading Data example
The following example performs a fetch request using `$.once()` function.
```js
function DogsWidget($) {
  const isLoading = $.use(true)
  const data = $.use([])

  $.once(async () => {
    const res = await fetch('https://dog.ceo/api/breeds/image/random/10')
    const json = await res.json()
    data(json.message)
    isLoading(false)
  })

  if (isLoading()) {
    $.h('div', $ => {
      $.t('Loading dogos...')
    })
  } else {
    for (const dogo of data()) {
      $.h('div', $ => {
        $.h('img', { src: dogo, width: 200 })
      })
    }
  }
}

$(document.getElementById('root'), DogsWidget)
```
> You can use normal JavaScript control flow statements to build the UI

### Generated HTML
```html
<div id="root">
    <div>Loading dogos...</div>
<div>

<!-- When the data is available -->
<div id="root">
    <div>
        <img src="..." width="200" />
    </div>
    <div>
        <img src="..." width="200" />
    </div>
    <div>
        <img src="..." width="200" />
    </div>
    <!-- Rest of the doggos -->
<div>
```

---
## Reusing Widgets example
The following example defines a table widget which is used by app widget.
```js
function TableWidget($, { cols, data }) {
  $.h('table', { className: 'table' }, $ => {
    $.h('thead', $ => {
      $.h('tr', $ => {
        for (const col of cols)
            $.h('th', col.header)
      })
    })
    $.h('tbody', $ => {
      for (const item of data)
        $.h('tr', $ => {
          for (const col of cols)
            $.h('td', $ => col.cell($, item))
        })      
    })
  })
}

function AppWidget($) {
  $.h('h1', $ => $.t('Some title'))
  TableWidget($, {
    data: [{ id: 1, name: 'Charmander' }, { id: 2, name: 'Charmeleon' }, { id: 3, name: 'Charizard' }],
    cols: [
      {
        header: $ => $.t('#'),
        cell: ($, item) => $.t(item.id),
      },
      {
        header: $ => $.t('Name'),
        cell: ($, item) => $.t(item.name),
      }
    ]
  })
}

$(document.getElementById('root'), AppWidget)
```
### Generated HTML
```html
<div id="root">
  <h1>Some title</h1>
  <table class="table">
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Charmander</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Charmeleon</td>
      </tr>
      <tr>
        <td>3</td>
        <td>Charizard</td>
      </tr>
    </tbody>
  </table>
</div>
```
