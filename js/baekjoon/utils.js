async function view_alert(event, msg) {
    return await new Promise(function(resolve) {
        chrome.storage.sync.get({
            [event]: "false",
        }, function(items) {
            if (items[event] === "false") {
                resolve(true);
                return true;
            }
            
            msg += "\n\n*alert은 설정 페이지에서 끌 수 있습니다.";
            if (event === "ask_auto_commit") {
                resolve(confirm(msg));
            }
            else {
                alert(msg);
            }
            resolve(false);
        })
    });   
}

async function append_commited_tag() {
    const commit_label = document.createElement("span");
    commit_label.innerHTML = "커밋 완료"
    commit_label.className = "problem-label-debug problem-label"
    
    const commit_label_wrap = document.createElement("li");
    commit_label_wrap.style.marginTop = "10px";
    commit_label_wrap.append(commit_label);
    
    const problem_menu_elem = document.querySelector(".problem-menu");
    problem_menu_elem.appendChild(commit_label_wrap);
}