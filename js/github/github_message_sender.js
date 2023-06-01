class Github_message_sender {
    constructor(github_access_token) {
        this.headers = {
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${github_access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    async #get_json_without_body(url, method) {
        let ret = await fetch(url, {
            method:  method,
            headers: this.headers,
        }).then((r) => {
            return r.text()
        });

        return JSON.parse(ret)
    }

    async get_json(url, method, body) {
        if (body === undefined) {
            return await this.#get_json_without_body(url, method)
        }

        let ret = await fetch(url, {
            method:  method,
            headers: this.headers,
            body:    body
        }).then((r) => {
            return r.text()
        });
        
        return JSON.parse(ret)
    }
}