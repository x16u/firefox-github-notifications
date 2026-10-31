import { getValue, setValue, getSettings } from "./lib/storage.js";

export async function fetchNewNotifications(settings) {
    const response = await fetch("https://api.github.com/notifications?all=false", { // all=true only for testing
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
    console.log(getValue(`notification:${notificationId}:title`));
    const url = await getValue(`notification:${notificationId}:url`);

    // wir brauchen die cookie id, sonst 404...
    const githubBrowserTabs = await browser.tabs.query({ url: "https://github.com/*" });
    if (url) await browser.tabs.create({
        url: url,
        cookieStoreId: githubBrowserTabs[0]?.cookieStoreId,
    });
}

export async function markAsSeen(id) {
    const seen = (await getValue("seenIds", []));
    if (!seen.includes(id)) {
        seen.push(id);
        await setValue("seenIds", seen);
    }
}

export function isNew(item) {
    return item.unread;
}

