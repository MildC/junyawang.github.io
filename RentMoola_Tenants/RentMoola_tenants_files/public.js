$(function () {
    $(".fade-label input").labelFader();
    $(".create-user .field-error input").live("keydown", function () {
        $(this).parent(".field-error").removeClass("field-error")
    });
    $(".create-user").submit(function (k) {
        var j = $(this);
        $("input[type=submit]", this).attr("disabled", "disabled");
        $.ajax({
            type: "POST",
            url: $(this).attr("action"),
            data: $(this).serialize(),
            dataType: "json",
            success: function (l) {
                document.location = l.url
            },
            error: function (n) {
                var m = $.parseJSON(n.responseText);
                $(".field").removeClass("field-error");
                $(".message-box-error", j).hide().children().remove();
                var o = "";
                $.each(m.errors, function (q, p) {
                    $("[name='user[" + q + "]']", j).parent(".field").addClass("field-error");
                    if (q == "password") {
                        $("[name='user[password_confirmation]']", j).parent(".field").addClass("field-error")
                    }
                    o += p + ". "
                });
                var l = $('<div class="signup-error" />').text(o);
                $(".message-box-error", j).append(l).show();
                $(".field-error:first", j).find("input").focus();
                $("body").addClass("page-error");
                $("input[type=submit]", j).removeAttr("disabled")
            }
        });
        return false
    });

    function f(j) {
        return j.replace(/^\//, "").replace(/(index|default).[a-zA-Z]{3,4}$/, "").replace(/\/$/, "")
    }
    var a = f(location.pathname);
    var d = e("html", "body");
    $("a.scroll-to, a.open-signup-drawer, a.open-reports-drawer").each(function () {
        var k = f(this.pathname) || a;
        if (a == k && (location.hostname == this.hostname || !this.hostname) && this.hash.replace(/#/, "")) {
            var j = $(this.hash),
                l = this.hash;
            if (l) {
                var m = j.offset().top;
                $(this).click(function (n) {
                    n.preventDefault();
                    $(d).animate({
                        scrollTop: m
                    }, 400, function () {
                        location.hash = l
                    })
                })
            }
        }
    });

    function e(m) {
        for (var l = 0, o = arguments.length; l < o; l++) {
            var n = arguments[l],
                j = $(n);
            if (j.scrollTop() > 0) {
                return n
            } else {
                j.scrollTop(1);
                var k = j.scrollTop() > 0;
                j.scrollTop(0);
                if (k) {
                    return n
                }
            }
        }
        return []
    }
    var g = $(".nav-drawer");
    var b = $(".drawer-content");
    slideDrawer = function (j) {
        if ($(j).is(":visible")) {
            g.slideUp(function () {
                b.hide()
            })
        } else {
            if (b.is(":visible")) {
                g.slideUp(function () {
                    b.hide();
                    $(j).show();
                    g.slideDown()
                })
            } else {
                $(j).show(function () {
                    g.slideDown()
                })
            }
        }
        $("input[name='user[email]']", $(j)).focus()
    };
    $(".signup-button").click(function (j) {
        slideDrawer("#signup");
        $(".signup-button").toggleClass("primary-button-active");
        $(".signin-button").removeClass("button-active");
        j.preventDefault()
    });
    $(".signin-button").click(function (j) {
        slideDrawer("#signin");
        $(".signin-button").toggleClass("button-active");
        $(".signup-button").removeClass("primary-button-active");
        j.preventDefault()
    });
    $(".close-drawer").click(function (j) {
        g.slideUp(function () {
            $(".drawer-content").hide()
        });
        $(".signin-button").removeClass("button-active");
        $(".signup-button").removeClass("primary-button-active");
        j.preventDefault()
    });
    
    $(".open-signup-drawer").click(function () {
        slideDrawer("#signup")
    });
    
    // Signup button hover actions
	$(".signup-button").hover(function()
	{
		$(".signup-button").toggleClass("primary-button-active");
				 		
	});
    
    //This is beginning of code I have to make #reports to work with drawer. Problem is, it will open as it is supposed to, and hitting any button on the page will make it close. That shouldn't happen. It should close if I hit close box icon, or the reports button again. Also, if I close it with the reports button or close icon, I can't reopen it. But if I hit another button on the page, it is like it resets it and then it works again, once... hahaha.
    
    $(".reports-button").click(function (j) {
        slideDrawer("#reports");
        $(".reports-button").toggleClass("button-active");
        j.preventDefault()
    });
    
    $(".close-drawer").click(function (j) {
        g.slideUp(function () {
            $(".drawer-content").hide()
        });
        $(".reports-button").removeClass("button-active");
        j.preventDefault()
    });
    
    $(".open-reports-drawer").click(function () {
        slideDrawer("#reports")
    });
    
    //End of my reports button code
    
    var i = {
        "sms_delivery[phone_number]": {
            phoneUS: true
        }
    };
    var c = {
        "#i-dont-exist": ["sms_delivery[phone_number]"]
    };
    var h = rentmoola.forms.initValidation($(".cardcase-sms-form"), i, undefined, c);
    $(".cardcase-sms-form").submit(function () {
        var j = $(this);
        var n = $("input[type=submit]", j);
        var k = $(".cardcase-message-box");
        var m = j.attr("action");
        var l = j.serialize();
        if (!h.form()) {
            return false
        }
        k.removeClass("cardcase-sms-send-error");
        $(".signup-errors", j).text("").hide();
        n.attr("disabled", "disabled");
        rentmoola.api.post(m, l, {
            success: function () {
                k.addClass("cardcase-sms-send-success")
            },
            error: function (o) {
                var p = {
                    field_name: "sms_delivery[phone_number]",
                    message: "Invalid phone number."
                };
                rentmoola.forms.addAPIErrors(c, [p]);
                k.addClass("cardcase-sms-send-error");
                $(".signup-errors", j).text(p.message).show();
                n.removeAttr("disabled")
            }
        });
        return false
    })
});