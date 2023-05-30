let oauth = get_Oauth2();
let commit_message_setter = get_Commit_message_setter();


function status_alert(timeout = 1500) {
    if ($("#status").css("display") == "none") {
        $("#status").toggle("slow")
    }
}


async function open_github_oauth() {
    let OAUTH_URL = `https://github.com/login/oauth/authorize?client_id=${oauth.client_id}&scope=repo`
    window.open(OAUTH_URL)
}


function set_input_values() {
    chrome.storage.sync.remove("github_commit_message")
    chrome.storage.sync.get({
        github_access_token: false,
        github_id: false,
        github_email: false,
        github_repository: false,
        github_commit_message_setter: commit_message_setter
    }, function(items) {
        for (const [key, value] of Object.entries(items)) {
            if (key != "github_commit_message_setter" && key != "github_access_token" && value != false) {
                document.getElementById(key).value = value
            }
        }
        
        commit_message_setter.set_commit_message(items.github_commit_message_setter.message, document.getElementById("github_commit_message_previewer"))
        document.getElementById("github_commit_message").value = items.github_commit_message_setter.message

        if (items.github_access_token != false) {
            document.getElementById("github_access_token").value = items.github_access_token.slice(0, 10).padEnd(items.github_access_token.length, "*");
            document.getElementById("github-get-access_token").style.display = "none";
        }
        else {
            document.getElementById("github_access_token").value = "Access 토큰 생성 버튼을 누른 뒤, 새로고침 해주세요"
        }
    });
    
}


function github_info_save() {
    const info_keys = ["github_id", "github_email", "github_repository"]
    info_keys.forEach(info_key => {
        let value = document.getElementById(info_key).value;
        if (value == "") {
            value = false;
        }
        chrome.storage.sync.set({
            [info_key]: value,
        })
    })
    
    status_alert();
}


function github_option_save() {
    const commit_message_element = document.getElementById("github_commit_message")
    const preview_elemnent = document.getElementById("github_commit_message_previewer")
    if (commit_message_element.value.trim() == "") {
        commit_message_setter.set_commit_message("[baekjoon] {problem_title} | 메모리: {memory} KB, 시간: {time} ms", preview_elemnent)
    }

    chrome.storage.sync.set({
        github_commit_message_setter: commit_message_setter
    })
    
    status_alert();
}


window.onload = (() => {
    document.getElementById("github-get-access_token").addEventListener("click", () => {
        open_github_oauth()
    })
    document.getElementById("github-info-save").addEventListener("click", () => {
        github_info_save()
    })
    document.getElementById("github-option-save").addEventListener("click", () => {
        github_option_save()
    })

    const commit_message_element = document.getElementById("github_commit_message")
    const preview_elemnent = document.getElementById("github_commit_message_previewer")
    commit_message_element.addEventListener("input", () => {
        commit_message_setter.set_commit_message(commit_message_element.value, preview_elemnent)
    })
    $("#github_commit_message").scroll(function () {
        console.log(this)
        $("#github_commit_message_previewer")
            .prop("scrollTop", this.scrollTop)
            .prop("scrollLeft", this.scrollLeft);
    })

    set_input_values();
});