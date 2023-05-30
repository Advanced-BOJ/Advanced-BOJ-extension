class Commit_message_setter {
    constructor () {
        this.message = "[baekjoon] {problem_title} | 메모리: {memory} KB, 시간: {time} ms"
        this.candidates = this.get_candidate_keys(this.message)
        this.keys = ["problem_title", "problem_id", "time", "memory"]
    }

    get_candidate_keys(commit_message) {
        let candidates = []

        const commit_message_length = commit_message.length;
        let preV = 0;
        while (true) {
            let regex_match = commit_message.slice(preV, commit_message_length).match("(?<=\{)[_a-zA-Zㄱ-ㅎ가-힣0-9]+(?=\})");
            if (regex_match == null) {
                break;
            }
            candidates.push({"value": regex_match[0], "index": regex_match.index + preV});
            preV += 1 + regex_match.index + regex_match[0].length;
        }
        return candidates
    }

    set_commit_message(commit_message, preview_element) {
        this.message = commit_message;
        this.candidates = this.get_candidate_keys(commit_message)

        let element_value = commit_message;
        for (let i = this.candidates.length - 1; i >= 0; i--) {
            const index = this.candidates[i].index;
            const value = this.candidates[i].value;
            if (this.keys.indexOf(value) >= 0) {
                element_value = element_value.slice(0, index) + `<span class="highlight">${value}</span>` + element_value.slice(index + value.length, element_value.length)
            }

        }
        preview_element.innerHTML = element_value
    }
}


function get_Commit_message_setter() {
    return new Commit_message_setter();
}