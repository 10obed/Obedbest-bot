import configmanager from "../utils/configmanager.js"
import fs from 'fs/promises'
import group from '../commands/group.js'
import block from '../commands/block.js'
import viewonce from '../commands/viewonce.js'
import tiktok from '../commands/tiktok.js'
import play from '../commands/play.js'
import sudo from '../commands/sudo.js'
import tag from '../commands/tag.js'
import take from '../commands/take.js'
import sticker from '../commands/sticker.js'
import img from '../commands/img.js'
import url from '../commands/url.js'
import sender from '../commands/sender.js'
import fuck from '../commands/fuck.js'
import bug from '../commands/bug.js'
import dlt from '../commands/dlt.js'
import save from '../commands/save.js'
import pp from '../commands/pp.js'
import premiums from '../commands/premiums.js'
import reactions from '../commands/reactions.js'
import media from '../commands/media.js'
import set from '../commands/set.js'
import fancy from '../commands/fancy.js'
import react from "../utils/react.js"
import info from "../commands/menu.js"
import { pingTest } from "../commands/ping.js"
import auto from '../commands/auto.js'
import uptime from '../commands/uptime.js'

async function handleIncomingMessage(client, event) {
    let lid = client?.user?.lid.split(':')[0] + '@lid'
    const number = client.user.id.split(':')[0]
    const messages = event.messages
    const publicMode = configmanager.config.users[number].publicMode
    const prefix = configmanager.config.users[number].prefix

    for (const message of messages) {
        const messageBody = (message.message?.extendedTextMessage?.text ||
                           message.message?.conversation || '').toLowerCase()
        const remoteJid = message.key.remoteJid
        const approvedUsers = configmanager.config.users[number].sudoList

        if (!messageBody || !remoteJid) continue

        auto.autotype(client, message)
        auto.autorecord(client, message)
        tag.respond(client, message)

        reactions.auto(
            client,
            message,
            configmanager.config.users[number].autoreact,
            configmanager.config.users[number].emoji
        )

        if (messageBody.startsWith(prefix) &&
            (publicMode ||
             message.key.fromMe ||
             approvedUsers.includes(message.key.participant || message.key.remoteJid) ||
             lid.includes(message.key.participant || message.key.remoteJid))) {

            const commandAndArgs = messageBody.slice(prefix.length).trim()
            const parts = commandAndArgs.split(/\s+/)
            const command = parts[0]

            switch (command) {

                // 🔥 AUTOSTATUS COMMAND
                case 'autostatus':
                    await react(client, message)
                    const arg = parts[1]

                    if (arg === 'on') {
                        global.autoStatusView = true
                        await client.sendMessage(remoteJid, {
                            text: '✅ Auto Status View Activated'
                        })
                    } 
                    else if (arg === 'off') {
                        global.autoStatusView = false
                        await client.sendMessage(remoteJid, {
                            text: '❌ Auto Status View Deactivated'
                        })
                    } 
                    else {
                        await client.sendMessage(remoteJid, {
                            text: `Usage:\n${prefix}autostatus on\n${prefix}autostatus off`
                        })
                    }
                    break

                case 'uptime':
                    await react(client, message)
                    await uptime(client, message)
                    break

                case 'ping':
                    await react(client, message)
                    await pingTest(client, message)
                    break

                case 'menu':
                    await react(client, message)
                    await info(client, message)
                    break

                // ⬇️ LE RESTE DE TON SWITCH RESTE IDENTIQUE ⬇️