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

async function check_update() {
    const releases_latest_url = "https://api.github.com/repos/Advanced-BOJ/Advanced-BOJ-extension/releases/latest";

    let manifest_data = chrome.runtime.getManifest();
    let ret_latest = await fetch(releases_latest_url, {
        headers: {
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        }
    }).then(r => r.json());

    if (ret_latest.name.slice(1) !== manifest_data.version) {
        const new_version_alert = document.createElement('div');
        new_version_alert.innerHTML = "Advanced BOJ Extension 업데이트 버전이 존재합니다";
        new_version_alert.style.textAlign = "center";
        new_version_alert.style.fontSize = "16px";
        new_version_alert.style.margin = "3px";

        const update_link_tag = document.createElement("a");
        update_link_tag.style.marginLeft = "10px"
        update_link_tag.target = "_blank"
        update_link_tag.innerHTML = "다운 받으러 가기"
        update_link_tag.href = releases_latest_url;
        new_version_alert.appendChild(update_link_tag);

        let wrapper_tag = document.querySelector(".wrapper");
        wrapper_tag.prepend(new_version_alert);
    }
}

chage_title()
wide_screen()
result_chnage()
check_update()
