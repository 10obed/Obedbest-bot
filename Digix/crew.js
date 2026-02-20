import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from 'baileys';
import readline from 'readline';
import deployAsPremium from '../utils/DigixV.js';
import configmanager from '../utils/configmanager.js';
import pino from 'pino';
import fs from 'fs';

const data = 'sessionData';

// 🔥 AutoStatus variable (désactivé par défaut)
global.autoStatusView = false;

async function connectToWhatsapp(handleMessage) {
    const { version } = await fetchLatestBaileysVersion();
    console.log(version);

    const { state, saveCreds } = await useMultiFileAuthState(data);

    const sock = makeWASocket({
        version: version,
        auth: state,
        printQRInTerminal: false,
        syncFullHistory: true,
        markOnlineOnConnect: true,
        logger: pino({ level: 'silent' }),
        keepAliveIntervalMs: 10000,
        connectTimeoutMs: 60000,
        generateHighQualityLinkPreview: true,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const reason = lastDisconnect?.error?.toString() || 'unknown';

            const shouldReconnect =
                statusCode !== DisconnectReason.loggedOut && reason !== 'unknown';

            if (shouldReconnect) {
                setTimeout(() => connectToWhatsapp(handleMessage), 5000);
            }

        } else if (connection === 'open') {
            console.log('✅ WhatsApp connection established!');

            // 🔥 AUTO STATUS VIEW + NORMAL HANDLER
            sock.ev.on('messages.upsert', async (msg) => {
                const message = msg.messages[0];
                if (!message) return;

                // 👀 Auto View Status (SI ACTIVÉ)
                if (message.key && message.key.remoteJid === 'status@broadcast') {
                    if (global.autoStatusView === true) {
                        await sock.readMessages([message.key]);
                        console.log('👀 Status viewed automatically!');
                    }
                    return;
                }

                handleMessage(sock, msg);
            });
        }
    });

    return sock;
}

export default connectToWhatsapp;