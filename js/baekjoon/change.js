function chage_title() {
    chrome.storage.sync.get({
        problem_title: 'number',
    }, function(items) {
        if (items.problem_title != 'number') {
            let problem_tags = DOMRegex("a", "^(https://www.acmicpc.net/problem/)[0-9]+", "data-original-title")
            for (let i of problem_tags) {
                let r = i.getAttribute("data-original-title")
                if (r.length > 15) {
                    r = r.slice(0, 15) + "...";
                }
                i.innerHTML = r;
            }

            let table_tag = document.querySelector("#status-table")
            if (table_tag != null) {
                let th_tags = table_tag.querySelectorAll("th")
                // for (let th_tag of th_tags) {
                //     th_tag.style.width = "auto";
                // }
                th_tags[2].style.width = "17%";
                th_tags[4].style.width = "auto";
                th_tags[5].style.width = "auto";
                th_tags[6].style.width = "auto";
            }
        }
    });
}


function wide_screen() {
    chrome.storage.sync.get({
        wide_screen: "default",
    }, function(items) {
        if (items.wide_screen != "default") {
            // console.log(items.wide_screen)
            let containers = document.querySelectorAll(".container")
            for (let i of containers) {
                if (i.className == "container content") {
                    i.className = "container-fluid content";
                }
                else {
                    i.className = "container-fluid";
                }

                i.style.paddingRight = "62px";
                i.style.paddingLeft = "62px";
            }
        }
    });
}

function result_chnage() {
    let keys = ['result-ac', 'result-pac', 'result-wa', 'result-tle', 'result-ole', 'result-wait', 'result-compile', 'result-judging']
    let values = ['맞았습니다!!', '맞았습니다!!', '틀렸습니다', '시간 초과', '출력 초과', '기다리는 중', '채점 준비 중', '채점 중']

    for (let idx = 0; idx < keys.length; idx++) {
        chrome.storage.sync.get({
            [keys[idx]]: [values[idx]],
        }, function(items) {
            let result_tags = document.querySelectorAll(`span[class*="${Object.keys(items)[0]}"]`);
            for (let result_tag of result_tags) {
                result_tag.textContent = Object.values(items)[0][0];
            }
            // console.log(Object.values(items)[0][0]);
        });
    }
}


chage_title()
wide_screen()
result_chnage()