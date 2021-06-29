# MSH-ui
<p align="center">
  <img src="https://raw.githubusercontent.com/mehdi-sh-hm/msh-ui/master/logo.png">
</p>
#### A **lightweight** JavaScript library for building user interfaces or UI components on top of web componant standard api.

## Features
- Very lightweight (about 500 bytes) :rocket:
- No Virtual Dom (Incrementaly update the Dom)
- Reactivity based on state :trophy:
- Simple and declarative syntax
- Fully compatible with web component standard api

## Examples
In this example we create a simple counter that when we change the state of the
element, the ui automatically will be updated. :boom:
```javascript
import { Element, ReactiveElement } from "@msh/ui";

@Element({
    selector: 'my-counter'
})
class MyCounter extends ReactiveElement() {
    constructor(
        /*html*/`
            <button event="inc:click">+</button>
            <div msh-count></div>
            <button event="dec:click">-</button>
        `, 
        // State
        {
            count: 0
        }, 
        // Computed
        {

        }, 
        // Actions
        {
            inc: () => {
                this.state.count++;
            },
            dec: () => {
                this.state.count--;
            }
        },
        // Transformers
        {

        }
    )
}
```
and you can use this element in your html template or html template of another element
```html 
<my-counter><my-counter>
```
