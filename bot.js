const { Client, GatewayIntentBits, EmbedBuilder, User, TextChannel } = require('discord.js');
const client = new Client({
    intents : [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});
const { war } = require('./civilWar.js');

var warList = {};
var partyList = {};

var helpEmbed = new EmbedBuilder()
.setTitle("내전봇")
.addFields(
    { name : "!내전", value : "내전봇의 기능을 알려줍니다." },
    { name : "!내전 생성 [내전명]", value : "새로운 내전을 생성합니다." },
    { name : "!내전 조회", value : "현재 생성된 내전들을 조회합니다." },
    { name : "!내전 참가 [내전명]", value : "해당 이름을 가진 내전에 참가합니다." },
    { name : "!게임팟 생성 [이름] [최대인원]", value : "새로운 게임팟을 생성합니다." },
    { name : "!게임팟 참가 [이름]", value : "해당 이름을 가진 게임팟에 참여합니다." },
    { name : "!내전 삭제", value : "자신이 생성한 내전을 삭제합니다." },
    { name : "!게임팟 삭제", value : "자신이 생성한 게임팟을 삭제합니다." }
)
.setFooter( { text : "Made by DevSeok & SEH00N" } );

client.on('messageCreate', msg => {
    if(!msg.content.startsWith('!')) return;

    const args = msg.content.replace('!', '').split(' ');
    if(args[0] == "내전")
    {
        if(args[1] == undefined)
            msg.channel.send({ embeds : [helpEmbed] });
        else
            switch(args[1])
            {
                case '생성':
                    if(args[2] == undefined)
                    {
                        msg.reply("이름을 입력해주세요.");
                        return;
                    }
                    var createName = msg.content.replace('!내전 생성 ', '');
                    if(Object.keys(warList).indexOf(createName) != -1)
                    {
                        msg.reply("이미 사용중인 내전 이름입니다.");
                        return;
                    }
                    var room = new war(createName, msg.author, msg.channel);
                    warList[room.name] = room;
                    var embed = new EmbedBuilder()
                        .setTitle("내전 생성 성공")
                        .addFields({ name : room.name, value : `호스트 : ${room.host.tag}\n현재 인원 : ${room.userList.length}`});
                    msg.channel.send({embeds : [embed]});

                    msg.author.createDM().then(dmChannel => {
                        dmChannel.send("내전 호출시간과 호출 메세지를 입력해주세요.");
                    });
                    break;
                case '조회':
                    var embed = new EmbedBuilder()
                        .setTitle("내전 정보");
                    if(Object.values(warList).length <= 0)
                        embed.addFields({ name : "조회할 내전이 없습니다.", value : "내전을 생성해주세요. "});
                    else 
                        Object.values(warList).forEach(item => {
                            embed.addFields({ name : item.name, value : `호스트 : ${item.host.tag}\n현재 인원 : ${item.userList.length}` });
                        });
                    msg.channel.send({embeds : [embed]});
                    break;
                case '참가':
                    if(args[2] == undefined)
                    {
                        msg.reply("이름을 입력해주세요.");
                        return;
                    }
                    var roomName = msg.content.replace('!내전 참가 ', '');
                    if(warList[roomName].userList.indexOf(msg.author) != -1)
                    {
                        msg.reply("이미 참가된 계정입니다.");
                        return;
                    }
                    warList[roomName].join(msg.author);
                    var result = warList[roomName];
                    var embed = new EmbedBuilder()
                        .setTitle("내전 참가 성공")
                        .addFields({ name : result.name, value : `호스트 : ${result.host.tag}\n현재 인원 : ${result.userList.length}`});
                    msg.channel.send({embeds : [embed]});
                    break;
                case '삭제':
                    break;
                default:
                    msg.channel.send({ embeds: [helpEmbed] });
                    break;
            }
    }
});

client.login(require('../tokens.json').CivilWar);