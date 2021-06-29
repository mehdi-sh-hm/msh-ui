const App = {
  elements: new Map(),
};

export function Element({ selector }) {
  return (constructor) => {
    App.elements.set(constructor, selector);
    customElements.define(selector, constructor);
  };
}
