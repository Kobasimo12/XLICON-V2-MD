import fetch from 'node-fetch';

export async function before(m) {
    if (m.isBaileys || !m.text) return false;

    // التحقق من وجود رابط إنستغرام في النص
    const regex = /(https?:\/\/(?:www\.)?instagram\.[a-z\.]{2,6}\/[\w\-\.]+(\/[^\s]*)?)/g;
    const matches = m.text.trim().match(regex);
    const chat = global.db.data.chats[m.chat];
    if (!matches || !matches[0] || chat.autodlInstagram !== true) return;

    let url = matches[0];
    if (!url) return m.reply("You need to provide the URL of an Instagram video, post, reel, or image");

    try {
        m.reply('Processing your request, please wait...');
        let res = await fetch(`${gurubot}/igdlv1?url=${url}`);
        let api_response = await res.json();

        if (!api_response || !api_response.data) {
            throw "No video or image found or Invalid response from API.";
        }

        const mediaArray = api_response.data;
        for (const mediaData of mediaArray) {
            const mediaType = mediaData.type;
            const mediaURL = mediaData.url_download;
            let caption = `HERE IS THE ${mediaType.toUpperCase()} >,<`;

            if (mediaType === 'video') {
                await this.sendFile(m.chat, mediaURL, 'instagram.mp4', caption, m);
            } else if (mediaType === 'image') {
                await this.sendFile(m.chat, mediaURL, 'instagram.jpg', caption, m);
            }
        }
    } catch (error) {
        await m.reply(`An error occurred: ${error.message}`);
    }
}

export const disabled = false;