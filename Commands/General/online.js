const CONSTANTS = require('../../data/Constants.json')
const BaseFunctions = require("../../utils/BaseFunctions")

class Online {
  constructor(bot, api){
    this.bot = bot;
    this.api = api;

    // Data
    this.name = "Online"
    this.description = "The current online users"
    this.usage = "online {option}"
    this.aliases = []
  }

  /* _buildMessage(length, players, server) {
    return `There ${length == 1 ? "is" : "are"} currently ${length == 0 ? "no" : length} ${length == 1 ? "player" : "players"} online in ${server}${length == 0 ? ". :(\n\n" : `:\n\`\`\`${(players.map(x => x.name)).join(", ")}\`\`\``}`
  }

  _buildSoloOptionMessage(online, args) {
    console.log(args)
    if(!CONSTANTS.SERVERS.includes(args.toLowerCase())) {
      return this._buildEntireMessage(online, `Sorry, we couldn't find the server ${args}. Here are all of the servers instead:\n\n`)
    }

    for(let server of online) {
      if(server.game == args.toLowerCase()) {
        let returnMessage = this._buildMessage(server.users.length, server.users, server.game)
        return returnMessage
      }
    }
  }

  _buildEntireMessage(online, messageString = "") {
    console.log(online)
    for(let i = 0; i < online.length; i++) {
      messageString += this._buildMessage(online[i].users.length, online[i].users, online[i].game)
      console.log(this._buildMessage(online[i].users.length, online[i].users, online[i].game))
    }
    
    return messageString
  }

  async execute(message, args){
    let online = await this.api.getOnline()

    let msg;

    if(args) {
      msg = this._buildSoloOptionMessage(online, args)
    } else {
      msg = this._buildEntireMessage(online)
    }

    message.channel.send(msg)
  } */

  async execute(message, args) {
    let online = await this.api.getOnline().catch(e => {
      console.error(e)
    })

    if(!online) {
      return message.channel.send("Error trying to find the online players")
    }

    let totalOnline = 0
    let totals = {}
    let msgString = ""
    // let server of online defines every value of array online to server
    for(let server of online) {
      // Let's not include the dev servers or member-less servers
      if(server.namespace != "gameslabs" || server.users.length == 0) continue

      totalOnline += server.users.length

      if(totals[server.game]) {
        totals[server.game] += server.users.length
      } else {
        totals[server.game] = server.users.length
      }
    }

    for(let game of Object.keys(totals)) {
      msgString += `${totals[game]} in ${BaseFunctions.capitalizeString(game.replace(/-/g, " "))}, `
    }

    // Here we prepend this string to msgString and then cut off the final space and comma from the final option (x, x, x, -> x, x, x)
    msgString = `There ${totalOnline == 1 ? "is" : "are"} currently ${totalOnline} ${totalOnline == 1 ? "player" : "players"} online:\n` + msgString.slice(0, -2)
    
    message.channel.send(msgString)

  }
}

module.exports = Online
