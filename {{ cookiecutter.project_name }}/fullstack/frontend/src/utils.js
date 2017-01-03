// HTML Escape helper utility
var util = (function () {
    // Thanks to Andrea Giammarchi
    var
        reEscape = /[&<>'"]/g,
        reUnescape = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g,
        oEscape = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        },
        oUnescape = {
            '&amp;': '&',
            '&#38;': '&',
            '&lt;': '<',
            '&#60;': '<',
            '&gt;': '>',
            '&#62;': '>',
            '&apos;': "'",
            '&#39;': "'",
            '&quot;': '"',
            '&#34;': '"'
        },
        fnEscape = function (m) {
            return oEscape[m];
        },
        fnUnescape = function (m) {
            return oUnescape[m];
        },
        replace = String.prototype.replace
        ;
    return (Object.freeze || Object)({
        escape: function escape(s) {
            return replace.call(s, reEscape, fnEscape);
        },
        unescape: function unescape(s) {
            return replace.call(s, reUnescape, fnUnescape);
        }
    });
}());

// Tagged template function
function html(pieces) {
    var result = pieces[0];
    var substitutions = [].slice.call(arguments, 1);
    for (var i = 0; i < substitutions.length; ++i) {
        result += util.escape(substitutions[i]) + pieces[i + 1];
    }

    return result;
}

const capitalize = str =>
    str[0].toUpperCase() + str.slice(1)

const pagination = (data, perPage) => {
    var pages;

    if (data.count) {
        let pagination_count = Math.ceil(data.count / perPage);
        if (pagination_count > 1) {
            pages = [...Array(pagination_count).keys()].map(item => item + 1);
        } else {
            pages = [];
        }
    }
    else {
        pages = [];
    }
    return pages;
}

const defaultValue = (key, value) => obj =>
    typeof obj[key] === 'undefined' || !obj[key] ? value : obj[key];

const isValue = (obj, key) =>
    typeof obj[key] === 'undefined' ? false : obj[key];

const onlyIfThen = (fn, truthy) =>
    !!truthy ? fn(truthy) : null

const onlyIf = truthy =>
    ({
        then: fn => onlyIfThen(fn, truthy)
    })

const qsParams = (haystack) => {
    var regex = /([^&=]+)=?([^&]*)/g;
    var match, store = {};
    haystack = haystack.substring(haystack.indexOf('?') + 1, haystack.length);
    while ((match = regex.exec(haystack))) {
        store[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
    }
    return store;
}

export { html, capitalize, pagination, defaultValue, isValue, onlyIf, qsParams }