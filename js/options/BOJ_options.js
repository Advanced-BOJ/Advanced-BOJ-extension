function status_alert(timeout = 1500) {
    if ($("#status").css("display") == "none") {
        $("#status").toggle("slow")
    }
}

function radio_options() {
    const names = ["wide_screen", "problem_title", "is_display_alert"]

    for (const name of names) {
        const radio_tags = document.querySelectorAll(`input[name='${name}']`)
        for (const radio_tag of radio_tags) {
            radio_tag.addEventListener("change", (evt) => {
                const check_value = document.querySelector(`input[name='${name}']:checked`).value;

                chrome.storage.sync.set({
                    [name]: check_value,
                }, function() {
                    // Update status to let user know options were saved.
                    status_alert()
                });
            })
        }
    }  
}


function boj_result_option() {
    var result_input_tags = document.querySelectorAll('input[class*="result-"]')
    for (let i of result_input_tags) {
        i.addEventListener("change", function(evt) {
            let save_option = {}
            for (let i of result_input_tags) {
                let cur_class = i.className.split(" ")[1]
                let cur_value = document.querySelector("td[class*='" + cur_class + "']").textContent;
                if (i.value != "") {
                    cur_value = i.value
                }
                chrome.storage.sync.set({
                    [cur_class]: [cur_value],
                })
                save_option[cur_class] = cur_value
            }
            status_alert()
        })
    }
}

function default_options() {
    defaults = ['맞았습니다!!', '맞았습니다!!', '틀렸습니다', '시간 초과', '출력 초과', '기다리는 중', '채점 준비 중', '채점 중']
    let result_td_tags = document.querySelectorAll('td[class*="result-"]')
    idx = 0
    for (let i of result_td_tags) {
        i.textContent = defaults[idx]
        chrome.storage.sync.set({
            [i.className]: [defaults[idx]],
        })
        idx++;
    }
    status_alert();
}

function restore_options() {
    chrome.storage.sync.get({
        is_display_alert: false,
        problem_title: "number",
        wide_screen: "default"
    }, function(items) {
        document.querySelector("input[value='" + items.is_display_alert + "']").checked = true
        document.querySelector("input[value='" + items.problem_title + "']").checked = true
        document.querySelector("input[value='" + items.wide_screen + "']").checked = true
    });

    var result_input_tags = document.querySelectorAll('input[class*="result-"]')
    for (let i of result_input_tags) {
        let cur_class = i.className.split(" ")[1]
        let cur_value = document.querySelector("td[class*='" + cur_class + "']").textContent;
        if (i.value != "") {
            cur_value = i.value
        }
        // console.log(cur_class)
        // console.log(cur_value)
        chrome.storage.sync.get({
            [cur_class]: [cur_value]
        }, function(items) {
            document.querySelector("td[class*='" + Object.keys(items)[0] + "']").textContent = Object.values(items)[0][0];
        })
    }
}


document.addEventListener('DOMContentLoaded', () => {
    restore_options();
    radio_options();
    boj_result_option();
});
document.getElementById("result_default").addEventListener("click", () => {
    default_options();
})