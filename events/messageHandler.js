const message = msg.messages[0];
if (!message.message) return;

const from = message.key.remoteJid;
const text = message.message.conversation || message.message.extendedTextMessage?.text || '';

if (text === '.autostatus on') {
    global.autoStatusView = true;
    await sock.sendMessage(from, { text: '✅ Auto Status View Activated' });
}

if (text === '.autostatus off') {
    global.autoStatusView = false;
    await sock.sendMessage(from, { text: '❌ Auto Status View Deactivated' });
}