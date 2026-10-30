import { getSettings, saveSettings } from "../lib/storage.js";

const pollInput = document.getElementById("pollIntervalMinutes");
const enabledInput = document.getElementById("notificationsEnabled");
const githubAccesToken = document.getElementById("githubAccesTokenString");
const status = document.getElementById("status");

async function load() {
    const settings = await getSettings();
    pollInput.value = settings.pollIntervalMinutes;
    githubAccesToken.value = settings.githubAccesToken || "";
    enabledInput.checked = settings.notificationsEnabled;
}

document.getElementById("save").addEventListener("click", async () => {
    await saveSettings({
        pollIntervalMinutes: Number(pollInput.value) || 10,
        githubAccesToken: githubAccesToken.value,
        notificationsEnabled: enabledInput.checked,
    });
    status.textContent = "Gespeichert.";
    setTimeout(() => (status.textContent = ""), 1500);
});

load();
