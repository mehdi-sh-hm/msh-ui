


export * from './core';


// Version 1
// const elements = this.shadowRoot.querySelectorAll(`[bind^="${prop}"]`);
// // debugger;
// elements.forEach((element) => {
//   const [_, key] = element.getAttribute('bind').split(':');
//   // debugger;

//   // expression
//   let _value = value;
//   const equal = element.getAttribute('bind-equal');
//   const bindValue = element.getAttribute('bind-if-equal-value');
//   const bindNotValue = element.getAttribute('bind-if-not-equal-value');
//   if (equal != undefined) {
//     // debugger;
//     if (equal == _value) {
//       if (bindValue != undefined) {
//         // debugger;
//         _value = bindValue;
//       }
//     } else {
//       if (bindNotValue != undefined) {
//         // debugger;
//         _value = bindNotValue;
//       }
//     }
//   }

//   if (element.tagName === 'TEMPLATE') {
//     if (element.getAttribute('show') !== 'true') {
//       element.parentNode.insertBefore(element.content.cloneNode(true), element.nextSibling);
//       element.setAttribute('show', 'true');
//     } else {
//       // element.nextElementSibling;
//       // element.nextSibling;
//       // debugger;
//       element.parentNode.removeChild(element.nextElementSibling || element.nextSibling);
//       element.removeAttribute('show');
//     }
//   } else {
//     if (key && key.startsWith('attributes')) {
//       element.setAttribute(key.replace('attributes.', ''), value);
//     } else if (key) {
//       set(element, key, _value);
//     } else {
//       element.innerHTML = _value;
//     }
//   }
//   // debugger;
// });

// const camelToDash = (v) => {
//   let ret = "",
//     prevLowercase = false;
//   for (let s of v) {
//     const isUppercase = s.toUpperCase() === s;
//     if (isUppercase && prevLowercase) {
//       ret += "-";
//     }
//     ret += s;
//     prevLowercase = !isUppercase;
//   }
//   return ret.replace(/-+/g, "-").toLowerCase();
// };