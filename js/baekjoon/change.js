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
        const header_elem = document.querySelector(".header");

        if (items.wide_screen != "default") {
            // console.log(items.wide_screen)
            let containers = document.querySelectorAll(".container")
            for (let i of containers) {
                if (header_elem.contains(i)) {
                    continue;
                }

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

async function get_github_oauth_token() {
    let ret = await chrome.storage.sync.get({"github_auto_committer": "undefined"});
    if (ret === "undefined") {
        return undefined;
    }
    return ret.github_auto_committer;
}

async function check_update() {
    const RELEASES_LATEST_API_URL = "https://api.github.com/repos/Advanced-BOJ/Advanced-BOJ-extension/releases/latest";
    const RELEASES_LATEST_URL = "https://github.com/Advanced-BOJ/Advanced-BOJ-extension/releases/latest";
    const github_auto_committer = await get_github_oauth_token();
    if (github_auto_committer == undefined) {
        return;
    }

    let manifest_data = chrome.runtime.getManifest();
    let ret_latest = await fetch(RELEASES_LATEST_API_URL, {
        headers: {
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${github_auto_committer.oauth_token}`,
            'X-GitHub-Api-Version': '2022-11-28'
        }
    }).then(r => r.json());

    const version_regexp = new RegExp("[\\d]+.[\\d]+.[\\d]+");
    if (version_regexp.exec(ret_latest.name)[0] !== manifest_data.version) {
        const new_version_alert = document.createElement('div');
        new_version_alert.innerHTML = "Advanced BOJ Extension 업데이트 버전이 존재합니다";
        new_version_alert.style.textAlign = "center";
        new_version_alert.style.fontSize = "16px";
        new_version_alert.style.margin = "3px";

        const update_link_tag = document.createElement("a");
        update_link_tag.style.marginLeft = "10px"
        update_link_tag.target = "_blank"
        update_link_tag.innerHTML = "다운 받으러 가기"
        update_link_tag.href = RELEASES_LATEST_URL;
        new_version_alert.appendChild(update_link_tag);

        let wrapper_tag = document.querySelector(".wrapper");
        wrapper_tag.prepend(new_version_alert);
    }
}

async function check_notice_list() {
    const NOTICE_LIST_URL = "https://api.github.com/repos/Advanced-BOJ/Advanced-BOJ-extension/issues/2";
    const github_auto_committer = await get_github_oauth_token();
    if (github_auto_committer == undefined) {
        return;
    }
    
    let ret_notice = await fetch(NOTICE_LIST_URL, {
        headers: {
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${github_auto_committer.oauth_token}`,
            'X-GitHub-Api-Version': '2022-11-28'
        }
    }).then(r => r.json());


    if (ret_notice.body != null) {
        const wrapper_tag = document.querySelector(".wrapper");
        wrapper_tag.id = "notice_list_wrapper"

        const notice_list = document.createElement("div");
        notice_list.innerHTML = ret_notice.body.replace("\n", "<br>");
        notice_list.style.display = "none"
        notice_list.id = "notice_list"
        notice_list.style.textAlign = "center";
        notice_list.style.fontSize = "16px";
        notice_list.style.margin = "3px";
        wrapper_tag.prepend(notice_list);

        const notice_alert_warp = document.createElement("div");
        notice_alert_warp.style.textAlign = "center";

        const notice_alert = document.createElement('span');
        notice_alert.className = "show_notice_list"
        notice_alert.innerHTML = "Advanced BOJ extension의 공지사항을 보시려면 클릭하세요."
        notice_alert.style.fontSize = "16px";
        notice_alert.style.margin = "3px";
        notice_alert.addEventListener("click", () => {
            $("#notice_list").toggle('fast');
            if (notice_alert.className === "show_notice_list") {
                notice_alert.innerHTML = "Advanced BOJ Extension의 공지사항을 숨기려면 다시 클릭하세요."
                notice_alert.className = "hide_notice_list"
            }
            else {
                notice_alert.innerHTML = "Advanced BOJ Extension의 공지사항을 보시려면 클릭하세요."
                notice_alert.className = "show_notice_list"
            }
        })
        notice_alert_warp.appendChild(notice_alert);

        const hide_notice_alert_btn = document.createElement("a");
        hide_notice_alert_btn.innerHTML = "하루동안 보지 않기"
        hide_notice_alert_btn.style.marginLeft = "10px"
        hide_notice_alert_btn.addEventListener("click", () => {
            notice_alert_warp.style.display = "none";
            notice_list.style.display = "none"

            const date = new Date()
            const remain_date = (24 * 3600) - ((date.getHours() * 3600) + (date.getMinutes() * 60))
            
            date.setSeconds(date.getSeconds() + remain_date);
            set_cookie('notice_list', 'not_view_notice_list', date); // 24시가 되야 쿠키가 제거됨
        })
        notice_alert_warp.appendChild(hide_notice_alert_btn);

        wrapper_tag.prepend(notice_alert_warp);
    }
}


async function load_check_func() {
    const is_view_notice_list = get_cookie("notice_list");
    if (is_view_notice_list === null) {
        await check_notice_list();
    }

    await check_update()
}

chage_title()
wide_screen()
result_chnage()
load_check_func();