let oauth = get_Oauth2();
let commit_message_setter = get_Commit_message_setter();
let github_auto_committer = undefined;

function status_alert() {
    const status_elem = $("#status")
    if (status_elem.css("display") === "none") {
        status_elem.toggle("slow")
    }
}


async function open_github_oauth() {
    let OAUTH_URL = `https://github.com/login/oauth/authorize?client_id=${oauth.client_id}&scope=repo user`
    window.open(OAUTH_URL)
    status_alert();
}


function set_input_values() {
    chrome.storage.sync.get({
        "github_auto_committer": "false"
    }, async function(items) {
        const repo_select_element = document.getElementById("github_repos_select")
        if (items.github_auto_committer === "false") {
            document.getElementById("github_commit_message").value = commit_message_setter.message
            commit_message_setter.set_commit_message(commit_message_setter.message, $("#github_commit_message_previewer")[0])
            repo_select_element.style.display = "none";
            return false;
        }
        document.getElementById("github-get-access_token").style.display = "none"

        github_auto_committer = items.github_auto_committer
        commit_message_setter.message = github_auto_committer.commit_message_setter.message
        document.getElementById("github_access_token").value = github_auto_committer.oauth_token
        document.getElementById("github_id").value = github_auto_committer.id
        document.getElementById("github_email").value = github_auto_committer.email

        const commit_message_previewer = document.getElementById("github_commit_message_previewer")
        document.getElementById("github_commit_message").value = commit_message_setter.message
        commit_message_setter.set_commit_message(github_auto_committer.commit_message_setter.message, commit_message_previewer)

        let github_repo = github_auto_committer.repository;
        document.getElementById("github_repository").style.display = "none"
        const github_message_sender = new Github_message_sender(github_auto_committer.oauth_token)
        const repos = await github_message_sender.get_json("https://api.github.com/user/repos", "GET")
        if (github_repo === false) {
            const option_tag = document.createElement('option');
            option_tag.innerHTML = "리포지토리를 선택해주세요"
            option_tag.className = "git_option"
            option_tag.selected = true
            repo_select_element.appendChild(option_tag)
            document.getElementById("github_repository").value = github_auto_committer.oauth_token
        }


        for (const repo of repos) {
            const option_tag = document.createElement('option');
            option_tag.innerHTML = repo.name
            option_tag.className = "git_option"
            if (github_repo === repo.name) {
                option_tag.selected = true;
            }
            repo_select_element.appendChild(option_tag)
        }
    });
}

// TODO: repository만 저장하도록 수정
function github_info_save() {
    if (github_auto_committer === undefined) {
        alert("Access 토큰 생성부터 진행해주세요")
        return false;
    }

    const repo_select_elem = document.getElementById("github_repos_select")
    if (repo_select_elem.value === "리포지토리를 선택해주세요") {
        alert("리포지토리를 선택해주세요");
        return false;
    }

    github_auto_committer.repository = repo_select_elem.value
    chrome.storage.sync.set({
        github_auto_committer: github_auto_committer
    })

    status_alert();
}


//
function github_option_save() {
    if (github_auto_committer === undefined) {
        alert("Access 토큰 생성부터 진행해주세요")
        return false;
    }

    const commit_message_element = document.getElementById("github_commit_message")
    const preview_element = document.getElementById("github_commit_message_previewer")
    if (commit_message_element.value.trim() == "") {
        commit_message_setter.set_commit_message("[baekjoon] {problem_title} | 메모리: {memory} KB, 시간: {time} ms", preview_element)
    }

    github_auto_committer.commit_message_setter = commit_message_setter;
    chrome.storage.sync.set({
        github_auto_committer: github_auto_committer
    })
    
    status_alert();
}


window.onload = (async () => {
    // chrome.storage.sync.remove("github_auto_committer")
    document.getElementById("github-get-access_token").addEventListener("click", () => {
        open_github_oauth()
    })
    document.getElementById("github-info-save").addEventListener("click", () => {
        github_info_save()
    })
    document.getElementById("github-option-save").addEventListener("click", () => {
        github_option_save()
    })

    const commit_message_element = $("#github_commit_message")
    const preview_element = $("#github_commit_message_previewer")
    commit_message_element.on('input', () => {
        commit_message_setter.set_commit_message(commit_message_element.val(), preview_element[0])
    })
    commit_message_element.scroll(function () {
        preview_element
            .prop("scrollTop", this.scrollTop)
            .prop("scrollLeft", this.scrollLeft);
    })

    set_input_values();
});