let notificationCounter = 0;

export async function showNotification({ id, title, message, iconUrl } = {}) {
    const notificationId = id ?? `notification-${Date.now()}-${notificationCounter++}`;

    await browser.notifications.create(notificationId, {
        type: "basic",
        iconUrl: browser.runtime.getURL(iconUrl ?? "icons/bell-ring.svg"),
        title,
        message,
    });

    return notificationId;
}

export async function clearNotification(id) {
    await browser.notifications.clear(id);
}

export function onNotificationClicked(handler) {
    browser.notifications.onClicked.addListener(handler);
}
