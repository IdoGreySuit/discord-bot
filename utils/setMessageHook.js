module.exports = async function(bot, config) {
    const amqp = require('amqplib/callback_api')

    let doublexp = config.doubleXP
    let infoChannel = config.infoChannel
    let exchange = config.infoExchange

    function send(msg) {
      bot.channels.get(infoChannel).send(msg)
    }

    amqp.connect(config.rabbitmq, function(error0, connection) {
      if (error0) {
        console.error(error0, connection)
        throw error0
      }
      connection.createChannel(function(error1, channel) {
        if (error1) {
          throw error1
        }
        channel.assertExchange(exchange, 'fanout', {
          durable: false
        })

        channel.assertQueue('', {
          exclusive: true
        }, function(error2, q) {
          if (error2) {
            throw error2;
          }
          channel.bindQueue(q.queue, exchange, '');

          channel.consume(q.queue, function(msg) {
            if(msg.content) {
              try {
                let json = JSON.parse(msg.content.toString())
                if (json.event === 'broadcast_message' && json.content.message.indexOf(' ') !== -1) {
                  send(`BROADCAST ${json.content.message.replace(/&[0-9a-zA-Z]/g, '')}`)
                } else if (json.event === 'minescape_xp_potion_v3') {
                  let duration = json.content.duration
                  let by = json.content.activatedBy
                  let minutes = duration - 1
                  send(`MINESCAPE Double xp has been enabled for ${minutes} minutes by ${by} (Enabling in one minute). ${doublexp}`)
                }
              } catch (e) {
                console.error(e)
              }
            }
          }, {
            noAck: true
          })
        })
      })
    })
    console.log("connected")
}
