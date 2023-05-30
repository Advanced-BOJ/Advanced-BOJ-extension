owner = "alirz-pixel"
repository = ""
access_token = "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"

// commiter -> this
// message는 문제 이름으로.
// 

function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}

async function create_commit(target_repo, path, commit_body) {
    // 어차피 본인 걸로만 하기 때문에 commiter 는 this로 관리하면 될 듯 --> chrome storage?
    message = commit_body["message"];
    commiter_name = commit_body["commiter"]["name"];
    commiter_email = commit_body["commiter"]["email"];
    content = utf8_to_b64(commit_body["content"]);

    await fetch(`https://api.github.com/repos/${owner}/${target_repo}/contents/${path}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `{"message":"${message}","committer":{"name":"${commiter_name}","email":"${commiter_email}"},"content":"${content}"}`
    }).then(r => {
        if (r.status == 422) {
            console.log("이미 커밋이 되어있습니다.")
        }
    });
}

async function delete_repository(target_repo) {
    fetch(`https://api.github.com/repos/${owner}/${target_repo}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${access_token}`
        }}).then(r => {
            if (r.status == 404) {
                console.log("이미 삭제되었거나 존재하지 않는 리포지토리입니다.")
            }
            else {
                console.log("정상적으로 삭제 되었습니다.")
            }
        });
}


// async function test() {
//     commit_body = await {
//         message: "첫 커밋 도전",
//         commiter: {
//             name: "alirz-pixel",
//             email: "alirce@naver.com"
//         },
//         content: await get_submitcode_by_id(51359596)
//     }
    
//     create_commit("test_repository", "test3.cpp", commit_body)
// }

// test()


let oauth = new Oauth2()
oauth.check_access_code();