function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}

async function create_commit(target_repo, path, commit_body, owner, access_token) {
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

async function delete_repository(target_repo, owner, access_token) {
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