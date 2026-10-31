import { getSettings, getValue } from "./lib/storage.js";
import { showNotification, onNotificationClicked } from "./lib/notifications.js";
import { fetchNewNotifications, handleNotificationClick, markAsSeen } from "./main.js";

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

    for (const item of items) {
        if (seen.includes(item.id)) continue;

        await showNotification({
            id: item.id,
            title: item.title,
            message: item.message,
        });

        await markAsSeen(item.id);
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

onNotificationClicked((notificationId) => {
    handleNotificationClick(notificationId);
});

browser.runtime.onMessage.addListener((message) => {
    if (message?.type === "check-now") {
        return pollAndNotify();
    }
});
