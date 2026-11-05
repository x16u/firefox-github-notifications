import { getValue } from "../lib/storage.js";

const notificationList = document.getElementById("notification-list");
const syncButton = document.getElementById("sync-now");

async function renderMissedNotifications() {
    notificationList.innerHTML = "";

    const popedUp = await getValue("popedUpIds", []);
    const seen = await getValue("seenIds", []);
    const missedNotifications = popedUp.filter((id) => !seen.includes(id));

    if (missedNotifications.length === 0) {
        const emptyState = document.createElement("li");
        emptyState.className = "empty-state";
        emptyState.textContent = "Keine verpassten Benachrichtigungen";
        notificationList.appendChild(emptyState);
        return;
    }

    for (const id of missedNotifications) {
        const notification = await getValue(`notification:${id}`);
        if (!notification) continue;

        const listItem = document.createElement("li");
        const listItemURL = document.createElement("a");
        const listItemTitle = document.createElement("strong");
        const listItemBody = document.createElement("div");
        const listItemMarkSeen = document.createElement("button");
        const listItemMarkSeenIcon = document.createElement("img");
        listItem.className = "notification-item";
        listItemURL.className = "notification-item-url";
        listItemTitle.className = "notification-item-title";
        listItemBody.className = "notification-item-body";
        listItemMarkSeen.className = "notification-item-mark-seen";
        listItemMarkSeen.type = "button";

        listItemMarkSeenIcon.src = "../../icons/circle-check-big.svg";
        listItemMarkSeen.appendChild(listItemMarkSeenIcon);

        listItemURL.href = "#";
        listItemURL.dataset.href = notification.url;
        listItemURL.target = "_blank";
        listItemURL.rel = "noopener noreferrer";
        listItemTitle.textContent = notification.title;
        listItemBody.textContent = notification.message;
        listItem.appendChild(listItemURL);
        listItemURL.appendChild(listItemTitle);
        listItemURL.appendChild(listItemBody);
        listItem.appendChild(listItemMarkSeen);

        listItemURL.addEventListener("click", async (event) => {
            event.preventDefault();

            await browser.runtime.sendMessage({ type: "notification-clicked", id });

            window.close();
        });

        listItemMarkSeen.addEventListener("click", async (event) => {
            event.preventDefault();

            await browser.runtime.sendMessage({ type: "mark-seen", id });

            listItem.remove();

            if (!notificationList.hasChildNodes()) {
                await renderMissedNotifications();
            }
        });

        notificationList.appendChild(listItem);
    }
}

await renderMissedNotifications();

syncButton.addEventListener("click", async () => {
    syncButton.classList.add("syncing");
    syncButton.disabled = true;

    try {
        await browser.runtime.sendMessage({ type: "sync-now" });
        await renderMissedNotifications();
    } finally {
        syncButton.classList.remove("syncing");
        syncButton.disabled = false;
    }
});

