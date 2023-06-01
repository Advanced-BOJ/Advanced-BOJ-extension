class Github_auto_committer {
    constructor(oauth_token, id, email) {
        this.oauth_token = oauth_token;
        this.id = id;
        this.email = email
        this.repository = false
        this.commit_message_setter = get_Commit_message_setter()
    }
    
    get_language_extension(language) {
        if (language.match("[cC][+]+") != null) {
            return "cpp"
        }
        else if (language.match("[cC][0-9]+") != null) {
            return "c";
        }
        else if (language.match("Java") != null) {
            return "java";
        }
        else if (language.match("Py") != null) {
            return "py";
        }
        else if (language.match("Rust") != null) {
            return "rs";
        }
        else if (language.match("js") != null) {
            return "js";
        }
        else if (language.match("Kotlin") != null) {
            return "kt";
        }
    }


    make_commit_message(submit_statues) {
        let commit_message = this.commit_message_setter.message;
        for (let i = this.commit_message_setter.candidates.length - 1; i >= 0; i--) {
            const index = this.commit_message_setter.candidates[i].index;
            const value = this.commit_message_setter.candidates[i].value;
            let concat_value = '{' + value + '}';

            if (value === "problem_id") {
                concat_value = submit_statues["problem_num"]
            }
            else if (value === "problem_title") {
                concat_value = submit_statues["problem_title"]
            }
            else if (value === "memory") {
                concat_value = submit_statues["memory"]
            }
            else if (value === "time") {
                concat_value = submit_statues["time"]
            }

            // '{'와 '}' 제거
            commit_message = commit_message.slice(0, index - 1) + concat_value + commit_message.slice(index + value.length + 1, commit_message.length)
        }

        return commit_message
    }


    async create_commit(submit_statues, source_code) {
        const language_extension = this.get_language_extension(submit_statues["language"])
        const path = `baekjoon/${submit_statues["problem_num"]} ${submit_statues["problem_title"]}.${language_extension}`
        const commit_message = this.make_commit_message(submit_statues)
        const btoa_source_code = Base64.encode(source_code)
        
        await fetch(`https://api.github.com/repos/${this.id}/${this.repository}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${this.oauth_token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `{"message":"${commit_message}","committer":{"name":"${this.owner}","email":"${this.email}"},"content":"${btoa_source_code}"}`
        }).then((r) => {
            if (r.status === 422) {
                console.log("이미 커밋이 되어있습니다.")
            }
        });
    }
}


async function get_validation_Github_auto_committer() {
    function open_option_with_alert(msg) {
        alert(msg)
        chrome.runtime.sendMessage({ message: "open_github_option" }, function (response) {});
    }

    let p = new Promise(function(resolve) {
        chrome.storage.sync.get({
            "github_auto_committer": "false"
        }, function(items) {
            if (items.github_auto_committer === "false") {
                open_option_with_alert("옵션에서 access token을 발급 받아주세요")
                resolve(null)
            }
            else if (items.github_auto_committer.repository === false) {
                open_option_with_alert("옵션에서 repository를 선택해주세요")
                resolve(null)
            }
            else {
                const github_auto_committer = new Github_auto_committer(
                    items.github_auto_committer.oauth_token,
                    items.github_auto_committer.id,
                    items.github_auto_committer.email
                )
                github_auto_committer.repository = items.github_auto_committer.repository
                github_auto_committer.commit_message_setter = items.github_auto_committer.commit_message_setter
                resolve(github_auto_committer)
            }
        })
    });
    
    return await p;
}


async function get_Github_auto_committer(github_access_token, github_id, github_email) {
    let p = new Promise(function(resolve) {
        chrome.storage.sync.get({
            "github_auto_committer": "false"
        }, function(items) {
            console.log(items)
            if (items.github_auto_committer === "false") {
                resolve(new Github_auto_committer(github_access_token, github_id, github_email))
            }
            else {
                resolve(items.github_auto_committer)
            }
        })
    });

    return await p;
}