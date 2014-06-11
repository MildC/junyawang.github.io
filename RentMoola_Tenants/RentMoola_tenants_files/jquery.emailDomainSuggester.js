$("#user-email, #email").blur(function () {
    var c = $(this).parents("form");
    var a = $(".message-box-error", c);
    var b = a.length;
    $(this).mailcheck({
        suggested: function (d, e) {
            var f = $("<div/>", {
                "class": "domain-suggestion",
                html: 'Did you mean <a href="#update" class="domain-suggestion-address">' + e.address + '@<strong class="domain">' + e.domain + "</strong></a>?",
                click: function (g) {
                    $(this).remove();
                    if (a.children().length == 0) {
                        a.hide();
                        $("body").removeClass("page-error")
                    }
                    d.val(e.full);
                    d.parent(".field-error").removeClass("field-error");
                    g.preventDefault()
                }
            });
            $(".domain-suggestion", c).remove();
            a.prepend(f).show();
            d.parent(".field").addClass("field-error");
            $("body").addClass("page-error")
        },
        empty: function (d) {
            $(".domain-suggestion", c).remove();
            if (a.children().length == 0) {
                a.hide();
                $("body").removeClass("page-error")
            }
            d.parent(".field-error").removeClass("field-error")
        }
    })
});
(function (a) {
    a.fn.mailcheck = function (d, f) {
        var e = ["yahoo.com", "yahoo.ca", "hotmail.com", "gmail.com", "me.com", "aol.com", "mac.com", "live.com", "comcast.net", "msn.com", "facebook.com"];
        if (typeof d === "object" && f === undefined) {
            d.domains = d.domains || e
        } else {
            var c = d;
            d = f;
            d.domains = c || e
        }
        var b = Kicksend.mailcheck.suggest(encodeURI(this.val()), d.domains);
        if (b) {
            if (d.suggested) {
                d.suggested(this, b)
            }
        } else {
            if (d.empty) {
                d.empty(this)
            }
        }
    }
})(jQuery);
var Kicksend = {
    mailcheck: {
        threshold: 3,
        suggest: function (d, b) {
            d = d.toLowerCase();
            var a = this.splitEmail(d);
            var c = this.findClosestDomain(a.domain, b);
            if (c) {
                return {
                    address: a.address,
                    domain: c,
                    full: a.address + "@" + c
                }
            } else {
                return false
            }
        },
        findClosestDomain: function (e, a) {
            var f;
            var c = 99;
            var b = null;
            for (var d = 0; d < a.length; d++) {
                if (e === a[d]) {
                    return false
                }
                f = this.stringDistance(e, a[d]);
                if (f < c) {
                    c = f;
                    b = a[d]
                }
            }
            if (c <= this.threshold && b !== null) {
                return b
            } else {
                return false
            }
        },
        stringDistance: function (f, b) {
            if (f == null || f.length === 0) {
                if (b == null || b.length === 0) {
                    return 0
                } else {
                    return b.length
                }
            }
            if (b == null || b.length === 0) {
                return f.length
            }
            var j = 0;
            var h = 0;
            var g = 0;
            var a = 0;
            var e = 5;
            while ((j + h < f.length) && (j + g < b.length)) {
                if (f[j + h] == b[j + g]) {
                    a++
                } else {
                    h = 0;
                    g = 0;
                    for (var d = 0; d < e; d++) {
                        if ((j + d < f.length) && (f[j + d] == b[j])) {
                            h = d;
                            break
                        }
                        if ((j + d < b.length) && (f[j] == b[j + d])) {
                            g = d;
                            break
                        }
                    }
                }
                j++
            }
            return (f.length + b.length) / 2 - a
        },
        splitEmail: function (a) {
            var c = a.split("@");
            if (c.length < 2) {
                return false
            }
            for (var b = 0; b < c.length; b++) {
                if (c[b] === "") {
                    return false
                }
            }
            return {
                domain: c.pop(),
                address: c.join("@")
            }
        }
    }
};