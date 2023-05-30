function view_alert(msg) {
    chrome.storage.sync.get({
        "is_display_alert": true,
    }, function(items) {
        if (items.is_display_alert == "true") {
            alert(msg);
        }
    })
}


async function check_judge_status() {
    // 수정 버튼이 있으면 내가 작성한 소스코드로 판단!
    console.log("====== [auto_commit log] =====");

    const recently_status = document.querySelector("[id*='solution'] a[href^='/submit']")
    if (recently_status == null) {
        view_alert("자동 커밋 가능한 제출 이력이 없습니다.")
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
        view_alert("정답 결과를 가져올 수 없습니다!!");
        return;
    }
    else if (patient == -1) {
        view_alert("정답처리된 결과만 오토 커밋 됩니다.");
        return;
    }

    console.log("정답처리가 되었습니다 오토 커밋을 진행합니다!")
    console.log(submit_statues)
    const source_code = await get_submitcode_by_id(submit_statues["submit_num"]);
    const github_auto_commiter = await get_Github_auto_commiter()
    if (github_auto_commiter == null) {
        return false;
    }
    await github_auto_commiter.create_commit(submit_statues, source_code);
}

check_judge_status();