import { getValue, setValue, getSettings } from "./lib/storage.js";

export async function fetchNewNotifications(settings) {
    const response = await fetch("https://api.github.com/notifications?all=true", { // all=true only for testing
        headers: {
            'X-GitHub-Api-Version': '2026-03-10',
            'Authorization': `Bearer ${settings.githubAccesToken}`,
        },
    });
    const items = await response.json();

    return items
        .filter((item) => isNew(item))
        .map((item) => ({
            id: item.id,
            title: item.subject.title,
            message: item.repository.full_name,
            url: item.subject.url,
        }));

    return [];
}

export async function handleNotificationClick(notificationId) {
    const url = await getValue(`notification:${notificationId}:url`);
    if (url) await browser.tabs.create({ url });
}

export async function markAsSeen(id) {
    const seen = (await getValue("seenIds", []));
    if (!seen.includes(id)) {
        seen.push(id);
        await setValue("seenIds", seen);
    }
}

export function isNew(item) {
    return true;
}

