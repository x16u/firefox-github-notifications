import { getSettings, getValue, setValue } from "./lib/storage.js";
import { showNotification, onNotificationClicked } from "./lib/notifications.js";
import { fetchNewNotifications, handleNotificationClick, markAsSeen, markAsPopedUp } from "./main.js";

const ALARM_NAME = "poll-notifications";

async function setupAlarm() {
    const settings = await getSettings();
    await browser.alarms.create(ALARM_NAME, {
        periodInMinutes: settings.pollIntervalMinutes,
    });
}

async function pollAndNotify() {
    const settings = await getSettings();
    if (!settings.notificationsEnabled) return;

    const items = await fetchNewNotifications(settings);
    const seen = await getValue("seenIds", []);
    const popedUp = await getValue("popedUpIds", []);

    for (const item of items) {
        if (seen.includes(item.id) || popedUp.includes(item.id)) continue;

        let url = item.url.replace("api.github.com/repos", "github.com")
            .replace("/pulls/", "/pull/")
            .replace("/issues/", "/issues/");

        await setValue(`notification:${item.id}`, {
            title: item.title,
            message: item.message,
            url: url,
        });

        await showNotification({
            id: item.id,
            title: item.title,
            message: item.message,
        });

        await markAsPopedUp(item.id);
    }
}

browser.runtime.onInstalled.addListener(() => {
    setupAlarm();
});

browser.runtime.onStartup.addListener(() => {
    setupAlarm();
});

browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === ALARM_NAME) {
        pollAndNotify();
    }
});

browser.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.pollIntervalMinutes) {
        setupAlarm();
    }
});

onNotificationClicked(async (notificationId) => {
    await Promise.all([
        markAsSeen(notificationId),
        handleNotificationClick(notificationId),
    ]);
});

browser.runtime.onMessage.addListener((message) => {
    if (message?.type === "check-now") {
        return pollAndNotify();
    }
});
