async function check_judge_status() {
    // 수정 버튼이 있으면 내가 작성한 소스코드로 판단!
    console.log("====== [auto_commit log] =====");

    const recently_status = document.querySelector("[id*='solution'] a[href^='/submit']")
    if (recently_status == null) {
        view_alert("is_display_alert", "자동 커밋 가능한 제출 이력이 없습니다.")
        return "fail";
    }

    const wrongs = ["tle", "ole", "mle", "wa", "rte", "ce", "pe"];
    let patient = 60;
    let submit_statues = {}
    while (patient) {
        let ret = await get_submit_statues_by_table(document);
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
        view_alert("is_display_alert", "정답 결과를 가져올 수 없습니다!!");
        return;
    }
    else if (patient == -1) {
        view_alert("is_display_alert", "정답처리된 결과만 오토 커밋 됩니다.");
        return;
    }
    console.log("정답처리가 되었습니다!")
    // console.log(submit_statues)

    const source_code = await get_submitcode_by_id(submit_statues["submit_num"]);
    const btoa_source_code = Base64.encode(source_code)
    const github_auto_committer = await get_validation_Github_auto_committer()
    if (github_auto_committer == null) {
        return false;
    }
    
    let ret_commited_info = await github_auto_committer.get_sha(submit_statues);
    if (ret_commited_info.message !== "Not Found") {
        ret_commited_info.content = ret_commited_info.content.replaceAll("\n", "");
        if (ret_commited_info.content === btoa_source_code) {
            console.log("해당 소스코드는 이미 github에 커밋되어 있습니다.")
            return;
        }
    }

    if (await github_auto_committer.ask_auto_commit()) {
        const is_finish_commit = await github_auto_committer.create_commit(submit_statues, source_code);
        if (is_finish_commit) {
            append_commited_tag();
            console.log("오토 커밋을 완료하였습니다.")
        }
    }
}

check_judge_status();