async function auto_commit(target_repo, baekjoon_user_id, git_owner, git_email, access_token) {
    console.log("====== [auto_commit log] =====");

    const regexp  = "(?<=[?&]user_id=)[^&]+"
    const cur_url = window.location.href
    if (cur_url.match(regexp)[0] != baekjoon_user_id) {
        alert("로그인 후, '내 제출' 페이지에서만 자동 커밋이 가능합니다.")
        return "fail";
    }
    
    const wrongs = ["tle", "ole", "mle", "wa", "rte", "ce", "pe"];
    let patient = 60;
    let submit_statues = {}
    while (patient) {
        let ret = await get_submit_statues_by_table();
        submit_statues = ret["data"]
        let submit_result = submit_statues["result"]
        console.log(`${patient} : 채점 상태... ${submit_result}`)
        if (submit_result == "ac") {
            break
        }
        else if (wrongs.includes(submit_result)) {
            patient = -1;
            break
        }
        patient--;     
        await sleep(1000);
    }
    if (patient == 0) {
        alert("정답 결과를 가져올 수 없습니다!!");
        return;
    }
    else if (patient == -1) {
        alert("정답처리된 결과만 오토 커밋 됩니다.");
        return;
    }

    console.log("정답처리가 되었습니다 오토 커밋을 진행합니다!")
    console.log(submit_statues)
    let source_code = await get_submitcode_by_id(submit_statues["submit_num"]);
    commit_body = {
        message: `[baekjoon] ${submit_statues["problem_title"]} | 메모리: ${submit_statues["memory"]} KB, 시간: ${submit_statues["time"]} ms`,
        commiter: {
            name: git_owner,
            email: git_email
        },
        content: source_code
    }
    await create_commit(target_repo, 
                        `baekjoon/${submit_statues["problem_title"]}.cpp`, 
                        commit_body,
                        git_owner,
                        access_token)
}


function main() {
    auto_commit(
        auto_commit_token.repository_name,
        auto_commit_token.boj_name,
        auto_commit_token.git_name,
        auto_commit_token.git_email,
        auto_commit_token.access_token
    )
}

main()