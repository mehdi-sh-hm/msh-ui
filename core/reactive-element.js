import { set } from '../utils';
import { Sizes } from './breakpoint';

let activeUpdate;

class Dep {
  name;
  subscribers = new Set();

  depend() {
    // debugger;
    if (activeUpdate) {
      this.subscribers.add(activeUpdate);
    }
  }

  notify() {
    // debugger;
    this.subscribers.forEach((sub) => sub());
  }
}

export function ReactiveElement() {
  let dep = new Dep();

  class ReactiveElement extends HTMLElement {
    staticTemplate;

    constructor(template, state, computed, actions, transformers, options) {
      super();
      if (typeof template === "string") {
        if (!ReactiveElement.staticTemplate) {
          const templateElement = document.createElement("template");
          templateElement.innerHTML = template;
          ReactiveElement.staticTemplate = templateElement;
        }
        this._template = ReactiveElement.staticTemplate;
      } else {
        this._template = template;
      }

      this._computed = computed;
      this.state = this.createState(state || {});
      this.actions = actions || {};
      this.transformers = transformers || {};

      if (options && options.customElements) {

      } else {
        this.attachShadow({ mode: "open" });
      }
    }

    connectedCallback() {
      if (this.shadowRoot) {
        this.shadowRoot.appendChild(this._template.content.cloneNode(true));
        this.createComputed(this._computed);
        this.handleActions();
        this.render();
        this.init();
      } else {
        this.appendChild(this._template.content.cloneNode(true));
        // console.log(this);
        this.init();
      }
    }

    // init lifecycle
    init() {}

    render() {
      for (const key in this.state) {
        if (Object.hasOwnProperty.call(this.state, key)) {
          this.renderBind(key, this.state[key]);
        }
      }
    }

    handleActions(subTree) {
      for (const key in this.actions) {
        if (Object.hasOwnProperty.call(this.actions, key)) {
          const elements = (subTree || this.shadowRoot).querySelectorAll(
            `[event^="${key}"]`
          );
          elements.forEach((element) => {
            const value = element.getAttribute("event");
            const [_, event] = value.split(":");
            // debugger;
            element.addEventListener(event, (e) => {
              // debugger;
              this.actions[key].apply(this, [e]);
            });
          });
        }
      }
    }

    createComputed(computed) {
      this.computed = computed;
      for (const key in this.computed) {
        if (Object.hasOwnProperty.call(this.computed, key)) {
          const original = this.computed[key];
          let previous;
          // Called every time that dependency of original function has changed;
          const wrapperUpdate = () => {
            // debugger;
            activeUpdate = wrapperUpdate;
            const result = original.apply(this);
            activeUpdate = null;
            if (previous !== result) {
              this.renderBind(key, result);
              previous = result;
            }
          };
          wrapperUpdate();
        }
      }
    }

    createState(state) {
      return new Proxy(state, {
        get(target, prop, receiver) {
          // debugger;
          if (dep) dep.depend();
          return Reflect.get(target, prop, receiver);
        },
        set: (obj, prop, value) => {
          const result = Reflect.set(obj, prop, value);
          dep.notify();
          this.renderBind(prop, value);
          return result;
        },
      });
    }

    renderBind(prop, value) {
      // Version 2
      const bindedElements = this.shadowRoot.querySelectorAll(`[msh-${prop}]`);
      // console.log(bindedElements);
      bindedElements.forEach((bindedElement) => {
        let _value = value;
        const bindOperations = bindedElement
          .getAttribute(`msh-${prop}`)
          .split(",");
        // debugger;
        bindOperations.forEach((operation) => {
          // debugger;
          const [target, transformer] = operation
            .split("|")
            .map((d) => d.trim());
          if (transformer) {
            const [transformerFunction, transformerArgs] =
              transformer.split(":");
            if (transformerFunction && this.transformers[transformerFunction]) {
              _value = this.transformers[transformerFunction](
                value,
                transformerArgs
              );
            }
          }
          if (target && target.startsWith("attributes")) {
            // if (prop === 'ghj') {
            //   debugger;
            // }
            bindedElement.setAttribute(
              target.replace("attributes.", ""),
              _value
            );
          } else if (target && target.startsWith("class")) {
            const [_, className] = target.split(".").map((d) => d.trim());
            if (_value && !bindedElement.classList.contains(className)) {
              bindedElement.classList.add(className);
            } else if (!_value && bindedElement.classList.contains(className)) {
              bindedElement.classList.remove(className);
            }
          } else if (target) {
            set(bindedElement, target, _value);
          } else {
            bindedElement.innerHTML = _value;
          }
        });
      });
    }

    getCssVar(name) {
      return getComputedStyle(document.documentElement).getPropertyValue(
        `--${name}`
      );
    }

    sizeState;
    _onResize = (event) => {
      const size = event.target.innerWidth;
      let currentSizeState;
      if (size < 768) {
        currentSizeState = Sizes.Small;
      } else if (size > 768 && size < 992) {
        currentSizeState = Sizes.Medium;
      } else  {
        currentSizeState = Sizes.Large;
      }

      if (typeof this.onResize === "function") {
        this.onResize(currentSizeState, event);
      }
      if (this.sizeState !== currentSizeState) {
        this.sizeState = currentSizeState;
        if (typeof this.onBreakpoint === "function") {
          this.onBreakpoint(currentSizeState, event);
        }
      }
    };

    closestNode(
      selector, // selector like in .closest()
      start = this, // extra functionality to skip a parent
      closest = (el, found = el && el.closest(selector)) =>
        !el || el === document || el === window
          ? null // standard .closest() returns null for non-found selectors also
          : found || closest(el.getRootNode().host) // recursion!! break out to parent DOM
    ) {
      return closest(start); // look from start
    }

    shadowDive(el, selector, match = (m, r) => console.warn("match", m, r)) {
      let root = el.shadowRoot || el;
      root.querySelector(selector) && match(root.querySelector(selector), root);
      [...root.children].map((el) => shadowDive(el, selector, match));
    }

    getAttr(name) {
      if (this.getAttribute(name) != undefined) {
        return this.getAttribute(name);
      }
    }

    emit(event, data) {
      this.dispatchEvent(new CustomEvent(event), { detail: data });
    }

    disconnectedCallback() {
      document.removeEventListener("resize", this._onResize);
      this.destory();
    }

    destory() {}

  }

  return ReactiveElement;
}
