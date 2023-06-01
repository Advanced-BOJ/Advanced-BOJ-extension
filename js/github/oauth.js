class Oauth2 {
    constructor() {
        this.client_id = "e182e01d58ae19a3c1ab";
        this.client_secret = "2d37df7e6d86e5f7eaffcbd0f5938a59fb2f16d4";
    }

    #get_access_code() {
        const url = new URL(window.location.href);
        const access_code = url.searchParams.get("code") 
        if (access_code == null) {
            return undefined;
        }
        
        return access_code;
    }


    async #get_access_token_and_save(access_code) {
        const data = {
            "client_id": this.client_id,
            "client_secret": this.client_secret,
            "code": access_code
        }

        let github_oauth_res = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((r) => r.text());

        github_oauth_res = JSON.parse(github_oauth_res)
        if (github_oauth_res.error !== undefined) {
            return github_oauth_res.error;
        }

        // id와 email 가져와야함.
        let github_message_sender = new Github_message_sender(github_oauth_res.access_token);
        const github_user_info = await github_message_sender.get_json("https://api.github.com/user", "GET")
        const github_id = github_user_info.login;

        let github_email_infos = await github_message_sender.get_json("https://api.github.com/user/emails", "GET")
        let github_email = ""
        for (const github_email_info of github_email_infos) {
            if (github_email_info.primary === true) {
                github_email = github_email_info.email;
            }
        }

        const github_auto_committer = await get_Github_auto_committer(github_oauth_res.access_token, github_id, github_email)
        chrome.storage.sync.set({
            "github_auto_committer": github_auto_committer
        })
    }


    async check_access_code() {
        const access_code = this.#get_access_code();
        if (access_code == null) {
            return false;
        }
        await this.#get_access_token_and_save(access_code);
        window.close();
    }
}


function get_Oauth2() {
    return new Oauth2();
}

if (window.location.href.includes("github")) {
    new Oauth2().check_access_code();
}
