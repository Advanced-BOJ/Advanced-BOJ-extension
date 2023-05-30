class Github_auto_commiter {
    constructor(oauth_token, id, email, repository, commit_message_setter) {
        this.oauth_token = oauth_token;
        this.id = id;
        this.email = email
        this.repository = repository
        this.commit_message_setter = commit_message_setter
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
            let concat_value = "";
            
            if (value == "problem_id") {
                concat_value = submit_statues["problem_num"]
            }
            else if (value == "problem_title") {
                concat_value = submit_statues["problem_title"]
            }
            else if (value == "memory") {
                concat_value = submit_statues["memory"]
            }
            else if (value == "time") {
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


async function get_Github_auto_commiter() {
    let p = new Promise(function(resolve, reject) {
        chrome.storage.sync.get({
            "github_access_token": false,
            "github_id": false,
            "github_email": false,
            "github_repository": false,
            "github_commit_message_setter": get_Commit_message_setter()
        }, function(items) {
            let lack_keys = []
            for (const [key, value] of Object.entries(items)) {
                if (key != "github_commit_message_setter" && value == false) {
                    lack_keys.push(key)
                }
            }

            if (lack_keys.length != 0) {
                let msg = "옵션에서 해당 필드를 채워주세요. \n\n부족한 필드: \n";
                for (let i = 0; i < lack_keys.length; i++) {
                    msg += lack_keys[i] + "  ";
                }
                alert(msg);
                chrome.runtime.sendMessage({ message: "popup" }, function (response) {});
                resolve(null);
            }
            
            const github_auto_commiter = new Github_auto_commiter(
                                            items.github_access_token, 
                                            items.github_id, 
                                            items.github_email, 
                                            items.github_repository, 
                                            items.github_commit_message_setter
                                        );
            resolve(github_auto_commiter);
        })
    });
    
    return await p;
}