export const DEFAULT_SETTINGS = {
    pollIntervalMinutes: 10,
    githubAccesToken: "",
    notificationsEnabled: true,
};

export async function getSettings() {
    const stored = await browser.storage.local.get(DEFAULT_SETTINGS);
    return { ...DEFAULT_SETTINGS, ...stored };
}

export async function saveSettings(partial) {
    await browser.storage.local.set(partial);
}

export async function getValue(key, fallback = undefined) {
    const result = await browser.storage.local.get(key);
    return key in result ? result[key] : fallback;
}

export async function setValue(key, value) {
    await browser.storage.local.set({ [key]: value });
}

export async function removeValue(key) {
    await browser.storage.local.remove(key);
}

