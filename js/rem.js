! function(n, e) {
	var t = n.documentElement,
		i = "orientationchange" in window ? "orientationchange" : "resize",
		o = function() {
			var n = t.clientWidth;
			n && (n >= 750 ? t.style.fontSize = "100px" : t.style.fontSize = 100 * (n / 750) + "px")
		};
	n.addEventListener && (e.addEventListener(i, o, !1), n.addEventListener("DOMContentLoaded", o, !1))
}(document, window);