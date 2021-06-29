export const Sizes = {
  Small: "small",
  Medium: "medium",
  Large: "large",
};

export function onResize(that) {
  window.addEventListener("resize", that._onResize);
  that._onResize({ target: { innerWidth: window.innerWidth } });
}
