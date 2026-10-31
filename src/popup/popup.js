document.getElementById("check-now").addEventListener("click", async () => {
    await browser.runtime.sendMessage({ type: "check-now" });
    window.close();
});
