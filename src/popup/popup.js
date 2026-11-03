import { getValue, setValue } from "../lib/storage.js";

const notificationList = document.getElementById("notification-list");
const popedUp = await getValue("popedUpIds", []);
const seen = await getValue("seenIds", []);
const missedNotifications = popedUp.filter((id) => !seen.includes(id));

// wir brauchen die cookie id, sonst 404...
const githubBrowserTabs = await browser.tabs.query({ url: "https://github.com/*" });

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

        const url = event.currentTarget.getAttribute("data-href");

        if (url) await browser.tabs.create({
            url: url,
            cookieStoreId: githubBrowserTabs[0]?.cookieStoreId,
        });

        seen.push(id);
        await setValue("seenIds", seen);
        await browser.runtime.sendMessage({ type: "notification-clicked", id });

        window.close();
    });


    notificationList.appendChild(listItem);
}

document.getElementById("check-now").addEventListener("click", async () => {
    await browser.runtime.sendMessage({ type: "check-now" });
    window.close();
});
