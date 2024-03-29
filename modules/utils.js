async function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    });
}

function DOMRegex(selector, regex, check_attirbute = "") {
    const regexp = RegExp(regex);

    let output = [];
    for (let i of document.querySelectorAll(selector)) {
        // console.log(i)
        if (regexp.test(i)) {
            if (check_attirbute == "" || i.hasAttribute('data-original-title') == true) {
                output.push(i);
            }
        }
    }
    return output;
}

function set_cookie(name, value, day) {
    document.cookie = name + '=' + value + ';expires=' + day + ';path=/';
}

function get_cookie(name) {
    const value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value ? value[2] : null;
};

function get_cookies(cookie_name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let split_cookie = cookies[i].split('=');
        console.log(split_cookie[0].trim())
        if (cookie_name === split_cookie[0].trim()) {
            return split_cookie[1];
        }
    }
    return null;
}