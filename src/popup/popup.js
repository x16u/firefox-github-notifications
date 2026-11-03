import { getValue } from "../lib/storage.js";

const notificationList = document.getElementById("notification-list");
const popedUp = await getValue("popedUpIds", []);
const seen = await getValue("seenIds", []);
const missedNotifications = popedUp.filter((id) => !seen.includes(id));

for (const id of missedNotifications) {
    const notification = await getValue(`notification:${id}`);
    if (!notification) continue;

    const listItem = document.createElement("li");
    const listItemURL = document.createElement("a");
    const listItemTitle = document.createElement("strong");
    const listItemBody = document.createElement("div");
    listItem.className = "notification-item";
    listItemURL.className = "notification-item-url";
    listItemTitle.className = "notification-item-title";
    listItemBody.className = "notification-item-body";

    listItemURL.href = "#";
    listItemURL.dataset.href = notification.url;
    listItemURL.target = "_blank";
    listItemURL.rel = "noopener noreferrer";
    listItemTitle.textContent = notification.title;
    listItemBody.textContent = notification.message;
    listItem.appendChild(listItemURL);
    listItemURL.appendChild(listItemTitle);
    listItemURL.appendChild(listItemBody);

    listItemURL.addEventListener("click", async (event) => {
        event.preventDefault();

        await browser.runtime.sendMessage({ type: "notification-clicked", id });

        window.close();
    });


    notificationList.appendChild(listItem);
}

document.getElementById("sync-now").addEventListener("click", async () => {
    await browser.runtime.sendMessage({ type: "sync-now" });
    window.close();
});
