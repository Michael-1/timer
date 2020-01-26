const m = require("mithril");

module.exports = {
  onbeforeremove: function(vnode) {
    vnode.dom.classList.add("fade");
    return new Promise(function(resolve) {
      vnode.dom.addEventListener("animationend", resolve);
    });
  },
  view: function(vnode) {
    return m(
      "text",
      vnode.attrs,
      vnode.children
    );
  }
};
