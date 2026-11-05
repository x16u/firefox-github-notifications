import { getValue, setValue, getSettings } from "./lib/storage.js";

export async function fetchNewNotifications(settings) {
    const response = await fetch("https://api.github.com/notifications?all=false", { // all=true only for testing
        headers: {
            'X-GitHub-Api-Version': '2026-03-10',
            'Authorization': `Bearer ${settings.githubAccesToken}`,
        },
    });
    const items = await response.json();

    if (response.status === 401) {
        throw new Error("Unauthorized: Invalid GitHub access token.");
    }

    return items
        .filter((item) => isNew(item))
        .map((item) => ({
            id: item.id,
            title: item.subject.title,
            message: item.repository.full_name,
            url: item.subject.url,
        }));
}

export async function handleNotificationClick(notificationId) {
    const notification = await getValue(`notification:${notificationId}`);

    // wir brauchen die cookie id, sonst 404...
    const githubBrowserTabs = await browser.tabs.query({ url: "https://github.com/*" });
    if (notification?.url) await browser.tabs.create({
        url: notification.url,
        cookieStoreId: githubBrowserTabs[0]?.cookieStoreId,
    });
}

export async function markAsSeen(id) {
    const seen = (await getValue("seenIds", []));
    if (!seen.includes(id)) {
        seen.push(id);
        await setValue("seenIds", seen);
        const response = await fetch("https://api.github.com/notifications/threads/" + id, {
            method: "PATCH",
            headers: {
                'X-GitHub-Api-Version': '2026-03-10',
                'Authorization': `Bearer ${(await getSettings()).githubAccesToken}`,
            },
        });

        if (!response.ok) {
            console.error(`Failed to mark notification ${id} as seen: ${response.statusText}`);
        }
    }
}

export async function markAsPopedUp(id) {
    const popedUp = (await getValue("popedUpIds", []));
    if (!popedUp.includes(id)) {
        popedUp.push(id);
        await setValue("popedUpIds", popedUp);
    }
}

export function isNew(item) {
    return item.unread;
}

