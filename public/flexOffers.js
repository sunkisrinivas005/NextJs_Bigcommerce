!(function () {
  var e = (window.flextrack = window.flextrack || []);
  if (e.invoked)
    window.console &&
      console.error &&
      console.error("FlexOffers library was included more than once.");
  else {
    (e.invoked = !0),
      (e.methods = ["init", "getClick", "track"]),
      (e.factory = function (r) {
        return function () {
          var t = Array.prototype.slice.call(arguments);
          return t.unshift(r), e.push(t), e;
        };
      });
    for (var r = 0; r < e.methods.length; r++) {
      var t = e.methods[r];
      e[t] = e.factory(t);
    }
    e.init = function (r) {
      var t = document.createElement("script");
      (t.type = "text/javascript"),
        (t.async = !0),
        (t.src =
          "https://advertiserpro.flexoffers.com/vendors/flexoffers/flexoffers.tracking.lib.js");
      var n = document.getElementsByTagName("script")[0];
      n.parentNode.insertBefore(t, n), (e.advertiserId = r);
    };
  }
})();

function getADVID(url) {
  var rx = new RegExp("[?&]ADVID=([^&]+).*$");
  var returnVal = url.match(rx);
  return returnVal === null ? "" : returnVal[1];
}

function getScriptUrl() {
  var scriptUrl;

  var scripts = document.getElementsByTagName("script");
  for (var index = 0; index < scripts.length; index++) {
    var script = scripts[index];
    if (script.src && script.src.indexOf("/flexOffers.js") !== -1) {
      scriptUrl = script.src;
    }
  }
  return scriptUrl;
}

var ADVID = getADVID(getScriptUrl());

(function () {
  flextrack.init(ADVID);
  flextrack.getClick();
  var checkoutDetails = window.Shopify.checkout;
  window.Shopify.checkout &&
    window.Shopify.checkout["order_id"] &&
    flextrack.track({
      order_number: checkoutDetails.order_id,
      order_amount: checkoutDetails.subtotal_price,
      order_coupon:
        checkoutDetails &&
        checkoutDetails.discount &&
        checkoutDetails.discount.code
          ? checkoutDetails.discount.code
          : "",
      order_items:
        checkoutDetails && checkoutDetails.line_items
          ? checkoutDetails.line_items.map((c) => {
              return {
                sku: c && c.sku ? c.sku : "EMPTYSKU",
                amount: c && c.price ? c.price : 0,
                quantity: c && c.quantity ? c.quantity : 0,
              };
            })
          : [],
    });
})();
