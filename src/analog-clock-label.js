const m = require("mithril");

module.exports = {
  oldAttrs: null,
  attrsChanged: false,

  onbeforeremove: function(vnode) {
    vnode.dom.classList.add("fade");
    return new Promise(function(resolve) {
      vnode.dom.addEventListener("animationend", resolve);
    });
  },

  onbeforeupdate: function(vnode, old) {
    if (vnode.attrs["data-totaltime"] != old.attrs["data-totaltime"]) {
      this.oldAttrs = old.attrs;
      this.attrsChanged = true;
    }
    return;
  },

  onupdate: function(vnode) {
    if (this.attrsChanged) {
      vnode.dom.firstElementChild.beginElement();
      this.attrsChanged = false;
    }
  },

  view: function(vnode) {
    const relOldPoint = this.oldAttrs && {
      x: this.oldAttrs["x"] - vnode.attrs["x"],
      y: this.oldAttrs["y"] - vnode.attrs["y"]
    };
    return m(
      "text",
      vnode.attrs,
      this.oldAttrs
        ? [
            vnode.children,
            <animateMotion
              id={vnode.key}
              begin="indefinite"
              dur="500ms"
              path={
                `M ${relOldPoint.x} ${relOldPoint.y}` +
                `L ${relOldPoint.x} ${relOldPoint.y}`
              }
            />,
            <animateMotion
              begin={vnode.key + ".end"}
              dur="500ms"
              calcMode="spline"
              keyTimes="0;1"
              keySplines="0.25 0.1 0.25 1.0"
              path={
                `M ${relOldPoint.x} ${relOldPoint.y}` +
                `A 35.5 35.5 0 ${
                  vnode.attrs["data-time"] === vnode.attrs["data-totaltime"] ||
                  this.oldAttrs["data-time"] === this.oldAttrs["data-totaltime"]
                    ? 1
                    : 0
                } ${
                  this.oldAttrs["data-totaltime"] >
                  vnode.attrs["data-totaltime"]
                    ? 0
                    : 1
                } 0 0`
              }
            />
          ]
        : vnode.children
    );
  }
};
