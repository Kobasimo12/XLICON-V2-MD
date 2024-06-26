import fetch from 'node-fetch';

const handler = async function (m, { conn }) {
    const args = m.text.split(' ');
    try {
        if (args.length > 0) {
            m.reply(wait);
            const url = args[0];
            let response = await fetch(`https://www.guruapi.tech/api/igdlv1?url=${url}`);
            let res = await response.json(); 

            if (!res || !res.result || res.result.length === 0) throw "لا يمكن العثور على الفيديو في الرابط";
            conn.sendFile(m.chat, res.result[0], '', '*تابع صاحب البوت في الإنستجرام ❤️* \n https://www.instagram.com/ovmar_1', m);

            for (let img of res.result) {   
                let ban = m.mentionedJid[0] || m.sender || conn.parseMention(args[0]) || (args[0].replace(/[@.+-]/g, '').replace(' ', '') + '@s.whatsapp.net') || '';

                if (ban) {
                    conn.sendFile(m.chat, img, '', null, m);
                }
            }
        }
    } catch (error) {
        console.log(error);
        m.reply('حدث خطأ أثناء معالجة طلبك.');
    }
};

handler.customPrefix = /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:tv\/|p\/|reel\/)(?:\S+)?$/ig;
handler.command = new RegExp();

export default handler;