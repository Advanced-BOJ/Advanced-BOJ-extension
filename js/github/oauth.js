// async function sleep(ms) {
//     return new Promise((resolve) => {
//         setTimeout(resolve, ms)
//     });
// }


// async function open_popup(client_id) {
//     let sum = 0;
//     // let params = `scrollbars=yes,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=1600,height=900,left=0,top=0`;
//     let params = `width=600,height=500`
//     let url = `https://github.com/login/oauth/authorize?client_id=${client_id}`;
//     var popup = window.open(url, "github과 연동", params);
//     popup.onload = function() {
//         popup.close();
//     }
// }

// async function access_token_test(client_id, client_secret) {
//     // let html_boj = await fetch(`https://www.acmicpc.net/source/${submission_id}`, {
//     //     method: 'GET',
//     // }).then((r) => r.text());
//     let get_git_code = await fetch(`https://github.com/login/oauth/authorize?client_id=${client_id}`, {
//         method: "GET",
//     }).then((r) => r.text());
//     console.log(get_git_code)

//     // let git_access_token = await fetch(`https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}`, {
//     //     method: "POST",
//     //     headers: {
//     //         Accept: 'application.json',
//     //         'Content-Type': 'application/json'
//     //     },
//     // }).then((r) => r.text());

//     // console.log(git_access_token)
// }

// // open_popup();
// client_id = "8d735ea57f1c6418e3a9"
// client_secret = "e3b72eb87d048f696cecf1cf66a173b2e77002ea"
// access_token_test(client_id)



// target_owner = "alirz-pixel"
// target_repo = "temp_repo"
// access_token = "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"

async function delete_repository() {
    let a = await fetch(`https://api.github.com/repos/${target_owner}/${target_repo}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${access_token}`
            }
        }).then((r) => (r.text));
    
    console.log(a)
}

async function get_repositorys() {
    let a = await fetch(`https://api.github.com/users/${target_owner}/repos`, {
            method: "GET",
        }).then((r) => (r.text()))

    console.log(a)
}


class Oauth2 {
    constructor() {
        this.client_id = "e182e01d58ae19a3c1ab";
        this.client_secret = "2d37df7e6d86e5f7eaffcbd0f5938a59fb2f16d4";
    }

    get_access_code() {
        const url = new URL(window.location.href);
        const access_code = url.searchParams.get("code") 
        if (access_code == null) {
            return undefined;
        }
        
        return access_code;
    }


    async check_access_code() {
        const access_code = this.get_access_code();
        if (access_code == null) {
            return false;
        }
        await this.get_access_token_and_save(access_code);
        window.close();
    }


    async get_access_token_and_save(access_code) {
        const data = {
            "client_id": this.client_id,
            "client_secret": this.client_secret,
            "code": access_code
        }

        let git_access_token = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((r) => r.text());

        
        git_access_token = JSON.parse(git_access_token)
        if (git_access_token.error != undefined) {
            return git_access_token.error;
        }

        chrome.storage.sync.set({
            "github_access_token": git_access_token.access_token,
        })
    }
}

function get_Oauth2() {
    return new Oauth2();
}