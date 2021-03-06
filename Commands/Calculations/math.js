const mathjs = require('mathjs')
const { RichEmbed } = require('discord.js')

class MathCommand {
  constructor(bot, api){
    this.bot = bot;
    this.api = api;

    this.name = "Math"
    this.description = "Does some math that you'd like it to do"
    this.usage = "math"
    this.aliases = []
  }

  execute(message, args){
    if(!args) return message.channel.send("Please do `!help math` for some more help")
    let solution; // If we do let solution = ... in the try/catch then we have scoping errors.
    try {
      // mathjs is godly
      solution = mathjs.eval(args)
    } catch {
      return message.channel.send("Computer machine broke, try a more simple problem or `!help math` for more help")
    }

    const embed = new RichEmbed()
    .setTitle(args)
    .setDescription(solution)
    .setColor("f99c18")

    message.channel.send(embed)
  }
}

module.exports = MathCommand
