async function get_submit_statues_by_table() {
    let ret = {
        "success": true,
        "error": "",
        "data": {}
    };

    // TODO: 로그인 확인

    let patient = 5;
    let status_tag = null;
    while (patient--) {
        status_tag = document.querySelector("#status-table tbody tr:first-child");    
        if (status_tag != null) {
            break;
        }
        console.log(`${patient} : 결과 가져오기 실패`);
        await sleep(500);
    }
    if (status_tag == null) {
        ret["success"] = false;
        ret["error"] = "결과를 불러올 수 없음";
        return ret;
    }

    let submit_result_tag = status_tag.querySelector(".result-text");
    let submit_result = submit_result_tag.getAttribute("data-color");
    let submit_num_tag = status_tag.querySelector("td:nth-child(1)");
    let submit_num = submit_num_tag.textContent;
    let problem_title_tag = status_tag.querySelector("td:nth-child(3) a");
    let problem_title = problem_title_tag.getAttribute("data-original-title");
    let problem_num = problem_title_tag.textContent;
    let memory_tag = status_tag.querySelector(".memory");
    let memory = memory_tag.textContent;
    let time_tag = status_tag.querySelector(".time")
    let time = time_tag.textContent;
    let language_tag = status_tag.querySelector("td:nth-child(7) a:first-child");
    let language = language_tag.textContent;

    ret["data"] = {
        "submit_num"   : submit_num,
        "problem_title": problem_title,
        "problem_num"  : problem_num,
        "result"       : submit_result,
        "memory"       : memory,
        "time"         : time,
        "language"     : language,
    }
    return ret;
}

async function get_result(problem_id) {
    // fetch()
}

async function get_submitcode_by_id(submissionId) {
    return fetch(`https://www.acmicpc.net/source/download/${submissionId}`, {method: "GET"})
        .then((res) => res.text())
}

async function get_submit_page_pId(problem_id) {
    return fetch(`https://www.acmicpc.net/submit/${problem_id}`, {method: "GET"})
        .then((res) => res.text());
}

async function get_submit_csrf_key(problem_id) {
    try {
        let submit_html_text = await get_submit_page_pId(problem_id);
        let html_parser = new DOMParser();
        const submit_html = html_parser.parseFromString(submit_html_text, "text/html")
        const csrf_key_tag = submit_html.querySelector("input[name='csrf_key']")
        return csrf_key_tag.value
    } catch (error) {
        console.log("로그인이 되어있지 않습니다.", error)   
    }
}

async function post_submit_source_code(problem_id, source_code) {
    const csrf_key = await get_submit_csrf_key(problem_id)

    const data = new FormData();
    data.append("problem_id", problem_id);
    data.append("language", 84);
    data.append("code_open", "close");
    data.append("source", source_code);
    data.append("csrf_key", csrf_key);

    fetch(`https://www.acmicpc.net/submit/${problem_id}`, {
        method: "POST",
        body: data
    });
}

async function main() {
    let result = await get_submit_statues_by_table();
    console.log(result);
    if (result == "ac") {
        let code = await get_submitcode_by_id(50654181);
        console.log(code);
    }
}

// async function test(problem_id) {
//     const source_code = await get_submitcode_by_id(51456688);
//     console.log(source_code)
//     await submit_source_code(problem_id, source_code);

//     patient = 5;
//     while (patient != 0) {
//         let result = await get_submit_statues_by_table()
//         console.log(result);
//         patient--;
//         await sleep(200);
//     }
// }
