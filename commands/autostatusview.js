// stockage simple en mémoire
global.autoStatusReact = global.autoStatusReact || false

module.exports = {
  name: "autostatus",
  description: "Active ou désactive auto réaction statut",
  async execute(sock, msg, args) {

    const from = msg.key.remoteJid

    if (!args[0]) {
      return sock.sendMessage(from, {
        text: "Usage: .autostatus on / off"
      })
    }

    if (args[0].toLowerCase() === "on") {
      global.autoStatusReact = true
      return sock.sendMessage(from, { text: "✅ Auto réaction statut ACTIVÉ" })
    }

    if (args[0].toLowerCase() === "off") {
      global.autoStatusReact = false
      return sock.sendMessage(from, { text: "⛔ Auto réaction statut DÉSACTIVÉ" })
    }

  }
}