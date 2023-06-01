async function url_wait() {
    patient = 5
    while (patient--) {
        console.log("testing..");
        // if (window.location.href == url) {
        // }
        await sleep(100)
    }
    console.log("end");
    return "finish!";
}

async function send_url_wait(sendResponse) {
    const f_url_wait = await url_wait();
    sendResponse({ f_url_wait })
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "open_github_option") {
        chrome.tabs.create({ url: chrome.runtime.getURL("options/git_options.html") });
    }
});