const Discord = require('discord.js');

class War
{
    /**
     * @param {string} name
     * @param {Discord.User} host 
     * @param {Discord.Channel} channel
     */
    constructor(name, host, channel)
    {
        this.name = name;
        this.baseChannel = channel;
        this.host = host;
        this.userList = new Array(host);
    }

    join(user) 
    {
        this.userList.push(user);
    }

    /**
     * @param {Discord.MessagePayload} message 
     */
    call(message)
    {
        this.host.createDM().then(dmChannel => dmChannel.send(message));
        this.userList.forEach(user => {
            user.createDM().then(dmChannel => dmChannel.send(message));
        });
    }
}

exports.war = War;