let v_size_running = false;

function asd() {
    document.querySelector(".container-custom").style.minHeight = ``

    document.getElementById("vsplitter").addEventListener("mousedown", () => {
        v_size_running = true;
    })
    document.getElementById("vsplitter").addEventListener("mouseup", () => {
        v_size_running = false;
    })
    document.querySelector("body").addEventListener("mousemove", (e) => {
        if (!v_size_running) {
            return;
        }
        console.log(e.clientX)
        document.getElementById("v-left").style.width = `${e.clientX - 80}px`;
    })
    window.addEventListener("resize", () => {
        document.getElementById("v-left").style.width = `${document.body.clientWidth / 2}px`;
    })
}


async function get_problem_info(problem_id) {
    let problem_info = await fetch(`https://www.acmicpc.net/problem/${problem_id}`, {method: "GET"})
        .then((res) => res.text());
    const boj_problem = new DOMParser().parseFromString(problem_info, 'text/html');
    document.querySelector("#problem").innerHTML = boj_problem.querySelector("#problem_description").innerHTML;
    document.querySelector("#nav-input").innerHTML = boj_problem.querySelector("#problem_input").innerHTML;
    document.querySelector("#nav-output").innerHTML = boj_problem.querySelector("#problem_output").innerHTML;
    let example = boj_problem.querySelectorAll("#problem-body .col-md-12")
    let example_output = "<div>"
    let idx = 0
    for (let i of example) {
        if (idx < 3) {
            idx++;
            continue;
        }
        example_output += "<div class='col-md-12'>" + i.innerHTML + "</div>";
    }
    example_output += "</div>"
    document.querySelector("#nav-input-output").innerHTML = example_output;
}

async function change_submit_view() {
    let patient = 10 * 5;
    let problem_tag = null;
    let footer_tag = null;
    while (patient > 0) {
        problem_tag = document.querySelector(".wrapper .content")
        footer_tag = document.querySelector(".footer-v3.no-print")
        console.log(problem_tag)
        console.log(footer_tag)
        if (problem_tag != null && footer_tag != null) {
            break;
        }
        await sleep(200);
        patient--;
    }
    if (patient == 0) {
        alert("새로운 뷰 로드 실패")
    }
    
    let submit_form = document.querySelector("#submit_form")
    let problem_menu_tag = document.querySelector(".problem-menu")
    
    problem_tag.innerHTML = 
    `
    <style>
        #top {
            background-color: #fdfdfd;
        }
        
        .container-custom {
            margin: auto;
            width: 89vw;
            overflow: hidden;
            height: calc(100vh - 16.9rem);
            display: flex;
        }
        
        .problem {
            display: flex;
            /*width: 37vw !important;*/
            height: 80vh;
            flex-direction: column;
            justify-content: space-between;
        }
        
        textarea {
            /*width: 37vw !important;*/
            resize: none;
        }
        
        #input-output {
            height: 34vh;
        }

        #nav-tabContent>div {
            padding: 10px;
            overflow-y: scroll;
            height: 20vh;
        }
        
        #problem {
            height: 40vh;
            overflow-y: scroll;
        }
        
        #source-code {
            height: 77vh;
        }
        
        #v-left {
            flex: 0 0 auto;
            width: 50%;
        }
        
        .ver-control {
            width:  41px;
            background: url("https://school.programmers.co.kr/assets/img-grippie-vertical-86e641691e88be56a100b80e3d437ae6effea08c189fdbdb2396825486763a15.png") no-repeat 1.25rem 50%;
            cursor: ew-resize;
        }
        
        #code {
            flex: 1 1 auto;
        }
        
        .control-box {
            display: flex;
            align-items: center;
            background-color: #6d6d6d;
            height: 50px;
            width: 98.2vw;
            justify-content: end;
        }
        
        .control-box button {
            height: 47px;
            margin-right: 43px;
        }
    </style>

    <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script src="https://code.jquery.com/ui/1.13.2/jquery-ui.js" integrity="sha256-xLD7nhI62fcsEZK2/v8LsBcb4lG7dgULkuXoXB/j91c=" crossorigin="anonymous"></script>
    <div class="container-custom">
        <div class="problem" id="v-left">
            <div>
                <span>Problem</span>
                <div class="form-control" id="problem" cols="30" rows="10"></div>
            </div>
            <div id="input-output">
                <ul class="nav nav-tabs">
                    <li class="active"><a data-toggle="tab" href="#nav-input">입력</a></li>
                    <li><a data-toggle="tab" href="#nav-output">출력</a></li>
                    <li><a data-toggle="tab" href="#nav-input-output">예제 입출력</a></li>
                </ul>

                <div class="tab-content" id="nav-tabContent">
                    <div id="nav-input" class="tab-pane fade in active">
                        ...
                    </div>
                    <div id="nav-output" class="tab-pane fade">
                        ...
                    </div>
                    <div id="nav-input-output" class="tab-pane fade">
                        ...
                    </div>
                </div>
            </div>
        </div>
        <div class="ver-control" id="vsplitter"></div>
        <div id="code">
            
        </div>
    </div>
    `;
    // <span>Source Code</span>
    // <textarea class="form-control" id="source-code" cols="30" rows="10"></textarea>

    // let control_tag = document.createElement("div");
    // // <button type="button" id="submit_button" class="btn btn-primary">제출하기</button>
    // control_tag.innerHTML = '<div class="control-box"></div>';
    // footer_tag.innerHTML = control_tag.innerHTML;
    footer_tag.innerHTML = "";
    document.querySelector("#code").appendChild(submit_form)

    let from_tags = document.querySelectorAll(".form-group")
    let idx = 0;
    for (let i of from_tags) {
        i.style.display = "none";
        if (idx >= 1) {
            break;
        }
        idx++;
    }
    document.querySelector(".control-label[for='source']").style.display = "none";
    document.querySelector("#submit_form legend").style.fontSize = "13px";
    document.querySelector("#submit_form legend").style.marginBottom = "0";
    document.querySelector(".CodeMirror-scroll").style.height = '68vh'
    

    problem_tag.insertBefore(problem_menu_tag, problem_tag.firstChild)
}

async function main() {
    const problem_ids = document.location.pathname.split('/')
    if (problem_ids.length == 4) {
        return false;
    }

    await change_submit_view();
    asd();
    await get_problem_info(problem_ids[2]);
}


main();


                // <nav>
                //     <div class="nav nav-tabs" id="nav-tab" role="tablist">
                //         <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-input" type="button" role="tab" aria-controls="nav-input" aria-selected="true">입력</button>
                //         <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-output" type="button" role="tab" aria-controls="nav-output" aria-selected="false">출력</button>
                //         <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-input-output" type="button" role="tab" aria-controls="nav-input-output" aria-selected="false">예제 입출력</button>
                //     </div>
                // </nav>
                // <div class="tab-content" id="nav-tabContent">
                //     <div class="tab-pane fade show active" id="nav-input" role="tabpanel" aria-labelledby="nav-input-tab">...</div>
                //     <div class="tab-pane fade" id="nav-output" role="tabpanel" aria-labelledby="nav-output-tab">...</div>
                //     <div class="tab-pane fade" id="nav-input-output" role="tabpanel" aria-labelledby="nav-input-output-tab">...</div>
                // </div>