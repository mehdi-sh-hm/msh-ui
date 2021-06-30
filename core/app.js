const load = [];
const App = {
  elements: new Map(),
  render: () => new Promise((resolve) => {
    setTimeout(() => {
      Promise.all(load).then(() => {
        document.getElementById('app').style.opacity = 1;
        console.log('App bootstrap');
        resolve();
      });
    }, 0);
  }),
};

window.App = App;

export function Element({ selector }) {
  return (constructor) => {
    App.elements.set(constructor, selector);
    customElements.define(selector, constructor);
    load.push(customElements.whenDefined(selector));
  };
}

