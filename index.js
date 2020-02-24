require('dotenv').config();
var Discord = require('discord.js');
var bot = new Discord.Client();
var TOKEN = process.env.TOKEN;
var prefix = '!';
//const fs = require('fs')
const fs = require('fs-extra');
bot.commands = new Discord.Collection()

var mysql = require('mysql');
	var con = mysql.createConnection({
		host: "remotemysql.com",
		user: "Mmi6Q34kwE",
		port: "3306",
		password: 'HBh33YHUxo',
		database: "Mmi6Q34kwE"
	});
var WHITELISTED = '659797919716605963';

fs.readdir("commands/", (err, files) => { 
	if(err) console.log(err);
	
	let jsfile = files.filter(f => f.split(".").pop() === "js")
	if(jsfile.length <= 0){ 
		console.log("Could not find commands!");
		return;
	}
	jsfile.forEach((f, i) =>{ 
		let props = require(`./commands/${f}`);
		console.log(`${f} loaded!`)
		bot.commands.set(props.help.name, props);
	});
});

bot.on('message', async message => {
	let prefix = "!";
	let messageArray = message.content.split(" ");
	let cmd = messageArray[0];
	let args = messageArray.slice(1);
	
	let commandfile = bot.commands.get(cmd.slice(prefix.length));
	if(commandfile) commandfile.run(bot,message,args);
});
bot.on("ready",() =>{
	var que = new Map()
	console.log("Ready!")
})

bot.on('guildMemberAdd', member => {
	console.log('User ' + member.user.username + '#' + member.user.discriminator + ' has joined the server!')
	var newid = member.user.id
	var mem = member.user
	con.query("SELECT * FROM bal WHERE DiscID = ?", [newid], function(err, pos) {
		if(pos === 'undefined' || pos.length == 0){
			if(err) return console.log(err)
			var inssql = "INSERT INTO bal (DiscID, Money, User) VALUES ?"
			var valsql = [
			[newid, 100, mem.username + '#' + mem.discriminator]
			]
			con.query(inssql, [valsql])
		}
	})
	con.query("SELECT * FROM verified WHERE DiscID = ?", [newid], function(err, verc) {
		if(verc === 'undefined' || verc.length == 0) return
			if(err) return console.log(err)
			member.addRole(WHITELISTED);
	})
	//con.end();
});


bot.login(TOKEN);

