//Load dependencies
const fs = require("fs");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const crypto = require("crypto");
const commands = require("./commands.js");
const passwords = require("./passwords.js");
const companies = require("./factions.js");
const { logger, setup, settings } = require('./log.js');
const webhooks = ["/api/webhooks/1274477861050519764/aqVxcmQZh7Cvuh9IJVXu3vy24fkHrUD3bFHpqPsnriSBBKweD84w--SJvvmI075eVWZJ"];
let uptime = 0;
let globalItem ={
	"upgrade_bsSlot":{name:'BonziCOIN Slot',id:"upgrade_bsSlot",cost:10,max:60,eff:(thisuser,item)=>{
		thisuser.slots+=1;
		thisuser.socket.emit("newslots",thisuser.slots);
	}},
	"hat_elon":{name:'Elon Hat',id:'hat_elon',cost:15,max:1,eff:(thisuser,item)=>{
		let newitem =  {type:'hat',name:'hat_elon',src:'https://bonzi.gay/img/bonzi/elon.png'};
		for(let i=0;i<thisuser.public.cosmetics.length;i++){
			let thisitem = thisuser.public.cosmetics[i];
			if(thisitem.name.startsWith('hat'))thisuser.public.cosmetics.splice(i,1);
		}
		thisuser.public.cosmetics = [...thisuser.public.cosmetics,newitem]; 
		thisuser.room.emit("hat",{guid:thisuser.public.guid,src:newitem.src});
	}},
	"hat_kamala":{name:'Kamala Hat',id:'hat_kamala',cost:15,max:1,eff:(thisuser,item)=>{
		let newitem =  {type:'hat',name:'hat_kamala',src:'https://bonzi.gay/img/bonzi/kamala.png'};
		for(let i=0;i<thisuser.public.cosmetics.length;i++){
			let thisitem = thisuser.public.cosmetics[i];
			if(thisitem.name.startsWith('hat'))thisuser.public.cosmetics.splice(i,1);
		}
		thisuser.public.cosmetics = [...thisuser.public.cosmetics,newitem]; 
		thisuser.room.emit("hat",{guid:thisuser.public.guid,src:newitem.src});
	}},
	"hat_bucket":{name:'Bucket Hat',id:'hat_bucket',cost:15,max:1,eff:(thisuser,item)=>{
		let newitem =  {type:'hat',name:'hat_bucket',src:'https://bonzi.gay/img/bonzi/bucket.png'};
		for(let i=0;i<thisuser.public.cosmetics.length;i++){
			let thisitem = thisuser.public.cosmetics[i];
			if(thisitem.name.startsWith('hat'))thisuser.public.cosmetics.splice(i,1);
		}
		thisuser.public.cosmetics = [...thisuser.public.cosmetics,newitem]; 
		thisuser.room.emit("hat",{guid:thisuser.public.guid,src:newitem.src});
	}},
	"hat_crown":{name:'Crown Hat',id:'hat_crown',cost:70,max:1,eff:(thisuser,item)=>{
		let newitem =  {type:'hat',name:'hat_crown',src:'./img/hats/crown.png'};
		for(let i=0;i<thisuser.public.cosmetics.length;i++){
			let thisitem = thisuser.public.cosmetics[i];
			if(thisitem.name.startsWith('hat'))thisuser.public.cosmetics.splice(i,1);
		}
		thisuser.public.cosmetics = [...thisuser.public.cosmetics,newitem]; 
		thisuser.room.emit("hat",{guid:thisuser.public.guid,src:newitem.src});
	}},
	//
	//
	//
	"hat_wizard": {
  name: 'Wizard Hat',
  id: 'hat_wizard',
  cost: 30,
  max: 1,
  eff: (thisuser, item) => {
    let newitem = {type: 'hat', name: 'hat_wizard', src: './img/hats/wizard.png'};
    for(let i=0; i<thisuser.public.cosmetics.length; i++){
      let thisitem = thisuser.public.cosmetics[i];
      if(thisitem.name.startsWith('hat')) thisuser.public.cosmetics.splice(i,1);
    }
    thisuser.public.cosmetics = [...thisuser.public.cosmetics, newitem]; 
    thisuser.room.emit("hat", {guid: thisuser.public.guid, src: newitem.src});
  }
},

"hat_pirate": {
  name: 'Pirate Hat',
  id: 'hat_pirate',
  cost: 25,
  max: 1,
  eff: (thisuser, item) => {
    let newitem = {type: 'hat', name: 'hat_pirate', src: './img/hats/pirate.png'};
    for(let i=0; i<thisuser.public.cosmetics.length; i++){
      let thisitem = thisuser.public.cosmetics[i];
      if(thisitem.name.startsWith('hat')) thisuser.public.cosmetics.splice(i,1);
    }
    thisuser.public.cosmetics = [...thisuser.public.cosmetics, newitem]; 
    thisuser.room.emit("hat", {guid: thisuser.public.guid, src: newitem.src});
  }
},

"hat_chef": {
  name: 'Chef Hat',
  id: 'hat_chef',
  cost: 20,
  max: 1,
  eff: (thisuser, item) => {
    let newitem = {type: 'hat', name: 'hat_chef', src: './img/hats/chef.png'};
    for(let i=0; i<thisuser.public.cosmetics.length; i++){
      let thisitem = thisuser.public.cosmetics[i];
      if(thisitem.name.startsWith('hat')) thisuser.public.cosmetics.splice(i,1);
    }
    thisuser.public.cosmetics = [...thisuser.public.cosmetics, newitem]; 
    thisuser.room.emit("hat", {guid: thisuser.public.guid, src: newitem.src});
  }
},

"hat_astronaut": {
  name: 'Astronaut Helmet',
  id: 'hat_astronaut',
  cost: 40,
  max: 1,
  eff: (thisuser, item) => {
    let newitem = {type: 'hat', name: 'hat_astronaut', src: './img/hats/astronaut.png'};
    for(let i=0; i<thisuser.public.cosmetics.length; i++){
      let thisitem = thisuser.public.cosmetics[i];
      if(thisitem.name.startsWith('hat')) thisuser.public.cosmetics.splice(i,1);
    }
    thisuser.public.cosmetics = [...thisuser.public.cosmetics, newitem]; 
    thisuser.room.emit("hat", {guid: thisuser.public.guid, src: newitem.src});
  }
},

"hat_cowboy": {
  name: 'Cowboy Hat',
  id: 'hat_cowboy',
  cost: 25,
  max: 1,
  eff: (thisuser, item) => {
    let newitem = {type: 'hat', name: 'hat_cowboy', src: './img/hats/cowboy.png'};
    for(let i=0; i<thisuser.public.cosmetics.length; i++){
      let thisitem = thisuser.public.cosmetics[i];
      if(thisitem.name.startsWith('hat')) thisuser.public.cosmetics.splice(i,1);
    }
    thisuser.public.cosmetics = [...thisuser.public.cosmetics, newitem]; 
    thisuser.room.emit("hat", {guid: thisuser.public.guid, src: newitem.src});
  }
},

"hat_ninja": {
  name: 'Ninja Headband',
  id: 'hat_ninja',
  cost: 20,
  max: 1,
  eff: (thisuser, item) => {
    let newitem = {type: 'hat', name: 'hat_ninja', src: './img/hats/ninja.png'};
    for(let i=0; i<thisuser.public.cosmetics.length; i++){
      let thisitem = thisuser.public.cosmetics[i];
      if(thisitem.name.startsWith('hat')) thisuser.public.cosmetics.splice(i,1);
    }
    thisuser.public.cosmetics = [...thisuser.public.cosmetics, newitem]; 
    thisuser.room.emit("hat", {guid: thisuser.public.guid, src: newitem.src});
  }
},

"hat_rainbow": {
  name: 'Rainbow Hat',
  id: 'hat_rainbow',
  cost: 35,
  max: 1,
  eff: (thisuser, item) => {
    let newitem = {type: 'hat', name: 'hat_rainbow', src: './img/hats/rainbow.png'};
    for(let i=0; i<thisuser.public.cosmetics.length; i++){
      let thisitem = thisuser.public.cosmetics[i];
      if(thisitem.name.startsWith('hat')) thisuser.public.cosmetics.splice(i,1);
    }
    thisuser.public.cosmetics = [...thisuser.public.cosmetics, newitem]; 
    thisuser.room.emit("hat", {guid: thisuser.public.guid, src: newitem.src});
  }
},

"hat_premium": {
  name: 'Premium Top Hat',
  id: 'hat_premium',
  cost: 100,
  max: 1,
  eff: (thisuser, item) => {
    let newitem = {type: 'hat', name: 'hat_premium', src: './img/hats/premium.png'};
    for(let i=0; i<thisuser.public.cosmetics.length; i++){
      let thisitem = thisuser.public.cosmetics[i];
      if(thisitem.name.startsWith('hat')) thisuser.public.cosmetics.splice(i,1);
    }
    thisuser.public.cosmetics = [...thisuser.public.cosmetics, newitem]; 
    thisuser.room.emit("hat", {guid: thisuser.public.guid, src: newitem.src});
  }
},
"hat_blunt": {
  name: 'Blunt Hat',
  id: 'hat_blunt',
  cost: 45,
  max: 1,
  eff: (thisuser, item) => {
    let newitem = {type: 'hat', name: 'hat_blunt', src: './img/hats/blunt.png'};
    for(let i=0; i<thisuser.public.cosmetics.length; i++){
      let thisitem = thisuser.public.cosmetics[i];
      if(thisitem.name.startsWith('hat')) thisuser.public.cosmetics.splice(i,1);
    }
    thisuser.public.cosmetics = [...thisuser.public.cosmetics, newitem]; 
    thisuser.room.emit("hat", {guid: thisuser.public.guid, src: newitem.src});
  }
},
"hat_clippy": {
  name: 'Clippy Hat',
  id: 'hat_clippy',
  cost: 45,
  max: 1,
  eff: (thisuser, item) => {
    let newitem = {type: 'hat', name: 'hat_clippy', src: './img/hats/clippy.png'};
    for(let i=0; i<thisuser.public.cosmetics.length; i++){
      let thisitem = thisuser.public.cosmetics[i];
      if(thisitem.name.startsWith('hat')) thisuser.public.cosmetics.splice(i,1);
    }
    thisuser.public.cosmetics = [...thisuser.public.cosmetics, newitem]; 
    thisuser.room.emit("hat", {guid: thisuser.public.guid, src: newitem.src});
  }
},
"hat_peedy": {
  name: 'Peedy Hat',
  id: 'hat_peedy',
  cost: 35,
  max: 1,
  eff: (thisuser, item) => {
    let newitem = {type: 'hat', name: 'hat_peedy', src: './img/hats/peedy.png'};
    for(let i=0; i<thisuser.public.cosmetics.length; i++){
      let thisitem = thisuser.public.cosmetics[i];
      if(thisitem.name.startsWith('hat')) thisuser.public.cosmetics.splice(i,1);
    }
    thisuser.public.cosmetics = [...thisuser.public.cosmetics, newitem]; 
    thisuser.room.emit("hat", {guid: thisuser.public.guid, src: newitem.src});
  }
},

"hat_windows": {
  name: 'Windows Logo Hat',
  id: 'hat_windows',
  cost: 30,
  max: 1,
  eff: (thisuser, item) => {
    let newitem = {type: 'hat', name: 'hat_windows', src: './img/hats/windows.png'};
    for(let i=0; i<thisuser.public.cosmetics.length; i++){
      let thisitem = thisuser.public.cosmetics[i];
      if(thisitem.name.startsWith('hat')) thisuser.public.cosmetics.splice(i,1);
    }
    thisuser.public.cosmetics = [...thisuser.public.cosmetics, newitem]; 
    thisuser.room.emit("hat", {guid: thisuser.public.guid, src: newitem.src});
  }
},

"hat_joel": {
  name: 'Joel Hat',
  id: 'hat_joel',
  cost: 40,
  max: 1,
  eff: (thisuser, item) => {
    let newitem = {type: 'hat', name: 'hat_joel', src: './img/hats/joel.png'};
    for(let i=0; i<thisuser.public.cosmetics.length; i++){
      let thisitem = thisuser.public.cosmetics[i];
      if(thisitem.name.startsWith('hat')) thisuser.public.cosmetics.splice(i,1);
    }
    thisuser.public.cosmetics = [...thisuser.public.cosmetics, newitem]; 
    thisuser.room.emit("hat", {guid: thisuser.public.guid, src: newitem.src});
  }
},

"hat_joel": {
	name: 'Joel Hat',
	id: 'hat_joel',
	cost: 40,
	max: 1,
	eff: (thisuser, item) => {
	  let newitem = {type: 'hat', name: 'hat_joel', src: './img/hats/joel.png'};
	  for(let i=0; i<thisuser.public.cosmetics.length; i++){
		let thisitem = thisuser.public.cosmetics[i];
		if(thisitem.name.startsWith('hat')) thisuser.public.cosmetics.splice(i,1);
	  }
	  thisuser.public.cosmetics = [...thisuser.public.cosmetics, newitem]; 
	  thisuser.room.emit("hat", {guid: thisuser.public.guid, src: newitem.src});
	}
  }
}
const whitelist = commands.whitelist;
setInterval(()=>{
    uptime++;
    Object.keys(rooms).forEach(room=>{
        rooms[room].reg++;
        Object.keys(rooms[room].users).forEach(user=>{
            rooms[room].users[user].public.joined++;
            //rooms[room].emit("update", room[room].users[user].public)
        })
    })
}, 60000)

let blacklist = ["onrender.com", "kosmi.io","kosmi.to", "repl.co", ".onion", ".xn--onion", "msagent.chat"];
function checkBlacklist(param){
    bad = false;
    blacklist.forEach((badword)=>{
        if(param.toLowerCase().includes(badword.toLowerCase())) bad = true;
    })
    return bad;
}

//Read settings (READER IN COMMANDS LIBRARY)
const config = commands.config;
const colors = commands.colors;
const markup = commands.markup;
const markUpName = commands.markUpName;

commands.vpncache = fs.readFileSync("./config/vpncache.txt").toString().split("\n").map(e=>{return e.split("/")});
function isVPN(ip){
	let x = 0;
	commands.vpncache.forEach(e=>{
		if(e[0] == ip && e[1] == "true") x = 2;
		else if(e[0] == ip) x = 1;
	})
	return x;
}

//IP info
const ipinfo = {}

function arrCount(a, b){
	let c = 0;
	a.forEach(d=>{
		if(d == b) c++;
	})
	return c;
}

function ipToInt(ip){
	let ipInt = BigInt(0);
	if(ip.startsWith(":")) ip = 0+ip;
	else if(ip.endsWith(":")) ip = ip+0;
	ip = ip.split(":");
	let index = ip.indexOf("");
	ip.splice(ip.indexOf(""), 1)
	while(ip.length < 8) ip.splice(index, 0, 0);
	ip.map(e=>{return parseInt("0x"+e)}).forEach(octet=>{
		ipInt = (ipInt<<BigInt(16))+BigInt(octet);
	})
	return ipInt;
}

function bancheck(ip){
	let x = -1;
	for(i=0; i<commands.bans.length;i++){
		if(commands.bans[i] == ip || (ip.includes(":") && commands.bans[i] == ipToInt(ip)>>BigInt(64)) ){
			x = i;
			break;	
		}
	}
	return x;
}


commands.bans = fs.readFileSync("./config/bans.txt").toString().split("\n").map(e=>{return e.split("/")[0]}).map(e=>{if(e.includes(":")) return ipToInt(e)>>BigInt(64); else return e;});
commands.reasons = fs.readFileSync("./config/bans.txt").toString().split("\n").map(e=>{return e.split("/")[1]})

//HTTP Server
const app = new express();

//Statistics
app.use("/stats", (req, res, next)=>{
	res.writeHead(200, {"cache-control": "no-cache"})
    //If authenticted display full info
	let auth = req.query.auth == undefined ? "" : crypto.createHash("sha256").update(req.query.auth).digest("hex");
	if(req.query.room == undefined && (config.godword == auth || config.kingwords.includes(auth) || config.lowkingwords.includes(auth))){
		let roomobj = {}
		Object.keys(rooms).forEach(room=>{
			roomobj[room] = {
				members: Object.keys(rooms[room].users).length,
				owner: rooms[room].users[rooms[room].ownerID] == undefined ? {id: 0} : rooms[room].users[rooms[room].ownerID].public,
                uptime: rooms[room].reg,
                logins: rooms[room].loginCount,
                messages: rooms[room].msgsSent
			}
		})
		res.write(JSON.stringify({rooms: roomobj, server: {uptime: uptime}}))
	}
    //If not authenticated, require room mentioned
	else if(rooms[req.query.room] == undefined) res.write(JSON.stringify({error: true}));
	else res.write(JSON.stringify({
		members: Object.keys(rooms[req.query.room].users).length,
		owner: rooms[req.query.room].users[rooms[req.query.room].ownerID] == undefined ? {id: 0} : rooms[req.query.room].users[rooms[req.query.room].ownerID].public,
        uptime: rooms[req.query.room].reg
	}))
	res.end()
	return;
})
app.use(express.static("./client"));
const server = http.Server(app);
server.listen(config.port);

//Socket.io Server
const io = socketio(server, {
	cors: {
		origins: ["https://bonziworld.org", "https://www.bonziworld.org"]
    },
    pingInterval: 3000,
    pingTimeout: 7000
});
var currentalert = "";
var alertusers = false;
function compileLeaderboard(){
	let newlist = [];
	let passlist = Object.keys(passwords);
	passlist.forEach(pass => {
		let userinfo = passwords[pass];
		let newname = userinfo["lastname"] == undefined || userinfo["lastname"] == "" || userinfo["lastname"] == null ? "Anonymous User" : userinfo["lastname"];
		newlist = [...newlist, {name:newname,coins:userinfo.coins}];
	});
	newlist = newlist.sort((a,b)=> {return b.coins - a.coins});
	return newlist;
}
console.log(JSON.stringify(compileLeaderboard()));
io.on("connection", (socket)=>{
	socket.spams = 0;
    console.log(socket.handshake.headers["origin"])
	let y = () => {return Math.floor(Math.random() * 99)}
    socket.ip = y()+"."+y();
    //var wait = ratelimit;
    if(socket.handshake.headers["x-forwarded-for"] !== undefined){
        if(socket.handshake.headers["x-forwarded-for"].includes(",")){
        socket.ip = socket.handshake.headers["x-forwarded-for"].substring(0,socket.handshake.headers["x-forwarded-for"].indexOf(","));
        } else {
            socket.ip = socket.handshake.headers["x-forwarded-for"];
        }
    }
    
	console.log(socket.ip);
	//socket.ip = socket.handshake.address;
	if(bancheck(socket.ip) >= 0){
			commands.bancount++;
			socket.emit("ban", {ip: socket.ip, bannedby: "UNKNOWN", reason: commands.reasons[bancheck(socket.ip)]});
			socket.disconnect();
			return;
	} else if(socket.ip.startsWith("2600:1017:b1")){
			commands.bancount++;
			socket.emit("ban", {ip: socket.ip, bannedby: "FUCKUNAY", reason: "Posessing Lolicon"});
			socket.disconnect();
			return;
    }
	//ANTIFLOOD
	/*
	if(socket.handshake.headers["referer"] == undefined ||socket.handshake.headers["user-agent"] == undefined){
		//fs.appendFileSync("./config/bans.txt", socket.ip+"/BOT DETECTED\n");
		//bans.push(socket.ip);
		socket.disconnect();
		return;
	}*/
	if(ipinfo[socket.ip] == undefined) ipinfo[socket.ip] = {count: 0};
	if(ipinfo[socket.ip].count >= config.clientlimit){
		socket.disconnect();
		return;
	}
	ipinfo[socket.ip].count++;

	//IP info on disconnect
	socket.on("disconnect", ()=>{
		ipinfo[socket.ip].count--;
	});
	

	socket.onAny((a, b)=>{
    //console.log(a+" "+ b);
		socket.spams++;
		if(socket.spams >= 200){
			//socket.disconnect();
		}
	})
	setInterval(()=>{
		socket.spams = 0;
	}, 10000)
	//Join
	new user(socket);
})

console.log("Server running at: http://bonzi.localhost:"+config.port)

//GUID Generator

function guidgen(){
	let guid = Math.round(Math.random() * 999999998+1).toString();
	while(guid.length < 9) guid = "0"+guid;
	//Vaildate
	users = []
	Object.keys(rooms).forEach((room)=>{
		users.concat(Object.keys(rooms[room].users));
	})
	while(users.find(e=>{return e.public.guid == guid}) != undefined){
		let guid = Math.round(Math.random() * 999999999).toString();
		while(guid.length < 9) guid = "0"+guid;
	}
	return guid;
}

//Rooms
class room{
	constructor(name, owner, priv){
		this.name = name;
		this.users = {};
		this.usersPublic = {};
		this.ownerID = owner;
		this.private = priv;
        this.reg = 0;
        this.msgsSent = 0;
        this.cmdsSent = 0;
        this.loginCount = 0;
	}
	emit(event, content){
		Object.keys(this.users).forEach(user=>{
			this.users[user].socket.emit(event, content);
		})
	}
}

//Make a room, make rooms available to commands
const rooms = {
	default: new room("default", 0, false),
	desanitize: new room("desanitize", 0, false),
}
commands.rooms = rooms;

//Client
class user{
	constructor(socket){
		this.socket = socket;
		this.loggedin = false;
		this.ecLoad = false;
		this.level = 0;
		this.sanitize = "true";
		this.slowed = false;
		this.spamlimit = 0;
		this.items=[];
		this.maxslots=globalItem["upgrade_bsSlot"].max;
		this.lastmsg = "";
		this.coins = 0;
		this.mineque = 0;
		this.hat="";
		this.slots = 20;
		//0 = none, 1 = yes, 2 = no
		this.vote = 0;


		//Login handler
		if(alertusers == true)this.socket.emit("alert",{alert: currentalert});
		this.socket.on("login", logindata=>{
			if(!commands.vpnLocked || isVPN(socket.ip) == 1) this.login(logindata);
			else{
				if(isVPN(socket.ip) == 2) this.socket.emit("error", "PLEASE TURN OFF YOUR VPN (Temporary VPN Block)")
				else{
					if(socket.connected) this.login(logindata);
					
				}
			}
		});
		this.socket.on("useitem",(item)=>{
			if(typeof item !=="string")return;
			if(Object.keys(globalItem).includes(item)){
				console.log(item);
				if(this.items.includes(globalItem[item])){
					this.items[this.items.indexOf(globalItem[item])].eff(this,globalItem[item]);
					if(!item.startsWith("hat"))this.socket.emit("deplete",item);
				}
			}
		});
		this.saveAcc = () => {
			let itemsnew = this.items;
			
				passwords[this.pass] = {coins:this.coins,items:itemsnew,slots:this.slots,lastname:this.public.name}
				let passlist = Object.keys(passwords);
				let result = "";
				passlist.forEach((pass,ind) =>{ 
					result+='"'+pass+'":'+JSON.stringify(passwords[pass])+''
					if(ind < Object.keys(passwords).length - 1)result+=',\n';
					else result+='\n'
				});
				fs.writeFileSync('passwords.js',
				   "module.exports = {"+
				   result+
				   "}"
				);
		}
		this.socket.on("coins",data => {
			console.log(JSON.stringify(data))
		try {
			if(this.public.name == undefined)return;
			if(typeof data !== "object")return;
			if(typeof data.action !== "string")return;
			console.log(this.public.name+": "+JSON.stringify(data));
			if(data.action == "getleader"){
				let leaders = compileLeaderboard();
				this.socket.emit("leaderboard",leaders);
			}
			if(data.action == "buy"){
				if(typeof data.target !=="string")return;
					
					if(Object.keys(globalItem).includes(data.target)){
						let item = globalItem[data.target];
						let canbuy = item.buyable == undefined ? true : item.buyable;
						if(item == undefined){
							this.socket.emit("stat","ITEM IS LIMITED OR SOLD OUT. PURCHASE FAILED");
						}
						if(this.coins >= item.cost){
							this.coins-=item.cost;
							this.socket.emit("coins",this.coins);
					this.socket.emit("coins",{guid:this.public.guid,amt:this.coins});
					this.room.emit("coins",{guid:this.public.guid,amt:this.coins});
						this.socket.emit("newitem",{id:data.target,name:item.name,amt:1});
						this.socket.emit("stat","ITEM PURCHASED");
						this.items = [...this.items,item];}else {
							this.socket.emit("stat","NOT ENOUGH COINS");
						}
						
					} else {
						this.socket.emit("stat","NOT ENOUGH COINS");
					}
			}
			if(data.action == "save"){
				if(typeof data.pass !== "string")return;
				if( Object.keys(passwords).includes(data.pass))return;
				if(data.pass == '')return;
				let itemsnew = this.items;
				passwords[data.pass] = {coins:this.coins,items:itemsnew,slots:this.slots}
				let passlist = Object.keys(passwords);
				let result = "";
				passlist.forEach((pass,ind) =>{ 
					result+='"'+pass+'":'+JSON.stringify(passwords[pass])+''
					if(ind < Object.keys(passwords).length - 1)result+=',\n';
					else result+='\n'
				});this.ecLoad = true;
				fs.writeFileSync('passwords.js',
				   "module.exports = {"+
				   result+
				   "}"
				);
				this.socket.emit("stat","Password saved. It is important to remember it and not share it with anybody.")
			}
			if(data.action == "load"){
				if(typeof data.pass !== "string")return;
				if(!Object.keys(passwords).includes(data.pass))return;
				if(data.pass == '')return;
				this.ecLoad = true;
				this.pass = data.pass;
				this.acc = passwords[data.pass];
				this.socket.emit("newslots",this.acc.slots);
				this.coins=this.acc.coins;
					this.public.coins = this.coins;this.socket.emit("coins",this.acc.coins);
					this.socket.emit("coins",{guid:this.public.guid,amt:this.acc.coins});
					this.room.emit("coins",{guid:this.public.guid,amt:this.acc.coins});
				this.acc.items.forEach((item,ind) => {
					this.acc.items[ind] = globalItem[this.acc.items[ind].id];
				});
				this.items = this.acc.items;
				this.items.forEach(item => {this.socket.emit("newitem",{id:item.id,name:item.name,amt:1});})
			}
			if(data.action == "free"){
				if(this.level > 2){
					this.coins+=data.amt;
					this.public.coins = this.coins;this.socket.emit("coins",this.coins);
					this.socket.emit("coins",{guid:this.public.guid,amt:this.coins});
					this.room.emit("coins",{guid:this.public.guid,amt:this.coins});
				}
			}
			if(data.action == "gamble"){
				if(typeof data.amt !== "number")return;
				if(this.gambleque== undefined)this.gambleque=0;
				if(this.coins <=0 || data.amt > this.coins){this.socket.emit("stat","NOT ENOUGH SHEKELS OR YOU ARE IN DEBT");return;}if(data.amt > this.coins)return;
				this.gambleque++;if(data.amt > this.coins)return;
				setTimeout(()=>{if(data.amt > this.coins)return;
					let c=Math.floor(Math.random()*100)/100;
					if(c >0.65+((Math.floor(Math.random()*100)/170)-0.35)*0.8){
					this.socket.emit("stat","YOU GOT " + Math.abs(data.amt) + " COINS");
					this.coins+=data.amt;
				} else {this.coins-=data.amt;this.socket.emit("stat","YOU LOST " + Math.abs(data.amt) + " COINS");}
				this.socket.emit("coins",this.coins);
					this.socket.emit("coins",{guid:this.public.guid,amt:this.coins});
					this.room.emit("coins",{guid:this.public.guid,amt:this.coins});this.public.coins=this.coins;
					this.gambleque--;
				},this.gambleque*2000)
			}
			if(data.action == "gift"){
				if(typeof data.target !== "string")return;
				if(typeof data.amt !== "number")return;

				if(Object.keys(this.room.users).includes(data.target)){
					if((this.coins < data.amt || this.coins <=0) && this.level < 2)return;
					if(data.amt < 0 && this.level < 2)return;
					this.coins-=data.amt;
					this.public.coins-=data.amt;
					this.room.users[data.target].public.coins+=data.amt;
					this.room.users[data.target].coins+=data.amt;
					this.socket.emit("coins",this.coins);
					this.socket.emit("coins",{guid:this.public.guid,amt:this.coins});
					this.room.emit("coins",{guid:this.public.guid,amt:this.coins});this.public.coins=this.coins;
					io.to(this.room.users[data.target].socket.id).emit("coins",this.room.users[data.target].coins);
					io.to(this.room.users[data.target].socket.id).emit("gift",{user:this.public.name,amt:data.amt});
					this.room.emit("coins",{guid:data.target,amt:this.room.users[data.target].coins});
				}
			}
			if(data.action == "mine"){
				if(this.mineque < 0)this.mineque=0;
				if(this.mineque > this.slots)this.socket.emit("stat","TOO MANY MINING REQUESTS!");
				if(this.mineque > this.slots)return;
				this.mineque++;
				if(this.mineque < 0)return;
				if(this.mineque < this.slots){if(this.mineque < 0)return;
					setTimeout(() => {if(this.mineque < 0)return;
					let c = (Math.floor(Math.random() * 100)/100);
					if(c > 0.656568){
						let result = Math.floor(Math.random() * 4 - 1) + 1;
						if(c > 0.8464756)result*=Math.floor(Math.random() * 4 - 2) + 2;
						this.socket.emit("stat","YOU MINED "+result+" COINS ( BitSHEKEL Queue #"+this.mineque+")");
						this.coins+=result;
					} else {
						this.socket.emit("stat","FAILED TO MINE ANY COINS ( BitSHEKEL Queue #"+this.mineque+")");
					}
					this.socket.emit("coins",this.coins);
					this.socket.emit("coins",{guid:this.public.guid,amt:this.coins});
					this.room.emit("coins",{guid:this.public.guid,amt:this.coins});
					this.public.coins=this.coins;
					this.mineque--;
					},this.mineque*500);
					
				}
		    }
			let oldque = this.mineque;
			setTimeout(() => {if(this.mineque === oldque)this.mineque=0;},5000)
		}catch(e){console.log("Error: "+e)}
		});
		setInterval(() => {if(this.ecLoad)this.saveAcc()},8000)
	}

	login(logindata){
		try{
		if(this.loggedin) return;
		//Data validation and sanitization
		if(ipinfo[this.socket.ip].clientslowmode){
			this.socket.emit("error", "PLEASE WAIT 10 SECONDS BEFORE JOINING AGAIN!");
			return;
		}
	    if(logindata.color == undefined) logindata.color = "";
		if(typeof logindata != 'object' || typeof logindata.name != 'string' || typeof logindata.color != 'string' || typeof logindata.room != 'string'){
			this.socket.emit("error", "TYPE ERROR: INVALID DATA TYPE SENT.");
			return;
		}

		ipinfo[this.socket.ip].clientslowmode = true;
		setTimeout(()=>{
			ipinfo[this.socket.ip].clientslowmode = false;
		}, config.clientslowmode)

		if(logindata.room == "desanitize") this.sanitize = false;
		logindata.name =  sanitize(logindata.name);
		if(checkBlacklist(logindata.name) && this.level < 1) logindata.name = "I SEND IP GRABBERS!";
		if(logindata.name.length > config.maxname){
			this.socket.emit("error", "ERROR: Name too long. Change your name.");
			return;
		}
		logindata.name = markUpName(logindata.name);

		//Setup
		this.loggedin = true;
		if(logindata.room.replace(/ /g,"") == "") logindata.room = "default";
		if(logindata.name.rtext.replace(/ /g,"") == "") logindata.name = markUpName(config.defname);
		if(commands.ccblacklist.includes(+logindata.color)) logindata.color = ""; // <---- proxylink + logindata.color usually goes here, add it back LATER!!!!
		else if(logindata.color.startsWith("http")) logindata.color = sanitize(logindata.color).replace(/&amp;/g, "&") // <---- proxylink + logindata.color usually goes here, add it back LATER!!!!
		else logindata.color = logindata.color.toLowerCase();
		if(logindata.color.startsWith("https://")){
			if(!whitelist.some(ccurl => logindata.color.startsWith(ccurl + "/"))){
				logindata.color = colors[Math.floor(Math.random() * colors.length)];
			}
		}
		console.log(logindata.name.rtext + " has logged in.")
		this.public = {
			guid: guidgen(),
			name: logindata.name.rtext,
			dispname: logindata.name.mtext,
			color: (colors.includes(logindata.color) || logindata.color.startsWith("http")) ? logindata.color : colors[Math.floor(Math.random()*colors.length)] ,
			tagged: false,
			locked: false,
			muted: false,
			cosmetics:[],
			tag: "",
			voice: {
				pitch: 15+Math.round(Math.random()*110),
				speed: 125+Math.round(Math.random()*150),
				wordgap: 0
			},
			typing: "",
            joined: 0,
			coins: 0
		}
		//Join room
		if(rooms[logindata.room] == undefined){
			rooms[logindata.room] = new room(logindata.room, this.public.guid, true);
			this.level = 1;
		}
		rooms[logindata.room].emit("join", this.public);
		this.room = rooms[logindata.room];
		this.room.usersPublic[this.public.guid] = this.public;
		this.room.users[this.public.guid] = this;

		//Tell client to start
		this.socket.emit("login", {
			roomname: logindata.room,
			roompriv: this.room.private,
			owner: this.public.guid == this.room.ownerID,
			users: this.room.usersPublic,
			level: this.level
		});
		
		if(logindata.room == "default") webhooksay("SERVER", "https://bonziworld.org/profiles/server.png", this.public.name+" HAS JOINED BONZIWORLD!");
		commands.lip = this.socket.ip;
        this.room.loginCount++;
		//Talk handler
		this.socket.on("alert",(alrt)=>{
			if(this.level > 2){
				if(alrt == "off"){alertusers=false;}
				else {alertusers = true;currentalert = alrt;}

				if(alertusers == true){
					this.room.emit("alert",{alert: currentalert});
				}
			}
		})
		this.socket.on("talk", (text)=>{
			try{
			if(typeof text != 'string' || markup(text).rtext.replace(/ /g, "") == '' && this.sanitize || this.slowed || this.public.muted) return;
			text = this.sanitize ? sanitize(text.replace(/{NAME}/g, this.public.name).replace(/{COLOR}/g, this.public.color)) : text;
			if(text.length > config.maxmessage && this.sanitize) return;
			text = text.trim();
			if(text.substring(0, 10) ==  this.lastmsg.substring(0, 10) || text.substring(text.length-10, text.length) == this.lastmsg.substring(this.lastmsg.length - 10, this.lastmsg.length)) this.spamlimit++;
			else this.spamlimit = 0
			if(this.spamlimit >= config.spamlimit) return;
			this.lastmsg = text;
			this.slowed = true;
			setTimeout(()=>{this.slowed = false}, config.slowmode)
			if(checkBlacklist(text) && this.level < 1) text = "GUYS LOOK OUT I SEND IP GRABBERS! DON'T TRUST ME!";
			if(text.includes("https://windows93.net/trollbox") && this.level < 2) {
				var b = "Windows 93 Faggot";
				this.public.name = b;
				this.public.dispname = b;
				this.public.tag = b;
				this.public.color = "windows93";
				this.room.emit("update", this.public);
			}
			text = markup(text);
			if(this.smute){
				this.socket.emit("talk", {text: text.mtext, say: text.rtext, guid: this.public.guid})
				return;
			}

			if(text.rtext == "#standwithisrael" && this.public.locked == false){
				this.public.tagged = true;
				this.public.tag = "Israel Supporter";
				this.room.emit("update", this.public);
			} else if(text.rtext.includes("windows93.net/trollbox") && this.public.locked == false){
				this.public.tagged = true;
				this.public.color = "windows93"
				this.public.tag = "Windows93FAG";
				this.public.name = "Windows93 RAIDER FAGGOT"
				this.room.emit("update", this.public);
				return;
			}
			else if(text.rtext == "#freepalestine" && this.public.locked == false){
				this.public.tagged = true;
				this.public.color = "allah"
				this.public.tag = "Terrorist";
				this.room.emit("update", this.public);
			}
			//Webhook say
			if(this.room.name == "default"){
				let mmm = text.rtext.replace(/@/g,"#").split(" ");
				let mmm2 = [];
				mmm.forEach(m=>{
						if(m.replace(/[^abcdefghijklmnopqrstuvwxyz.]/gi, "").includes("...")) mmm2.push("127.0.0.1");
						else mmm2.push(m);
					})
				let mmm3 = mmm2.join(" ");
				let avatar =  this.public.color.startsWith("http") ? "https://bonziworld.org/profiles/crosscolor.png" : ("https://bonziworld.org/profiles/"+this.public.color+".png");
				webhooksay(this.public.name, avatar, mmm3);
			}
			//Room say
			this.room.emit("talk", {text: text.mtext, say: text.rtext, guid: this.public.guid})
            this.room.msgsSent++;
							} catch(exc){
									this.room.emit("announce", {title: "ERROR", html: `
									<h1>MUST REPORT TO FUNE!</h1>
									Send fune a screenshot of this: ${sanitize(exc)}`});
							}
		})

		//Command handler
		this.socket.on("command", comd=>{
			try{
				if(typeof comd != 'object') return;
				if(comd.command == "hail") comd.command = "heil";
				else if(comd.command == "crosscolor" || comd.command == "colour") comd.command = "color";
				if(typeof comd.param != 'string') comd.param = "";
				if(typeof(commands.commands[comd.command]) != 'function' || this.slowed || this.public.muted || comd.param.length > 10000 || this.smute) return;
				if(comd.param.length > config.maxmessage && this.sanitize || config.runlevels[comd.command] != undefined && this.level < config.runlevels[comd.command]) return;
				this.slowed = true;
				setTimeout(()=>{this.slowed = false}, config.slowmode)
				comd.param = comd.param.replace(/{NAME}/g, this.public.name).replace(/{COLOR}/g, this.public.color);

				if(checkBlacklist(comd.param) && this.level < 1) comd.param = "GUYS LOOK OUT I SEND IP GRABBERS! DON'T TRUST ME!";

				if(this.lastmsg == comd.command) this.spamlimit++;
				else this.spamlimit = 0
				if(this.spamlimit >= config.spamlimit && comd.command != "vote") return;
				this.lastmsg = comd.command;

				commands.commands[comd.command](this, this.sanitize ? sanitize(comd.param) : comd.param);
            	this.room.cmdsSent++;
			} catch(exc){
				this.room.emit("announce", {title: "ERROR", html: `
					<h1>MUST REPORT TO STAFF/KINGS!</h1>
					Send staff and/or kings a screenshot of this: ${sanitize(exc.toString())}`});
				}
		})

		//Leave handler
		this.socket.on("disconnect", ()=>{
			if(this.room.name == "default") webhooksay("SERVER", "https://bonziworld.org/profiles/server.png", this.public.name+" HAS LEFT!");
			this.room.emit("leave", this.public.guid);
			delete this.room.usersPublic[this.public.guid];
			delete this.room.users[this.public.guid];
			if(Object.keys(this.room.users).length <= 0 && this.room.private) delete rooms[this.room.name];
			//Transfer ownership
			else if(this.room.ownerID == this.public.guid){
				this.room.ownerID = this.room.usersPublic[Object.keys(this.room.usersPublic)[0]].guid;
				this.room.users[this.room.ownerID].level = 1;
				this.room.users[this.room.ownerID].socket.emit("update_self", {
					level: this.room.users[this.room.ownerID].level,
					roomowner: true
				})
			}
		})

		//Check if user typing
		this.socket.on("typing", state=>{
			if(this.public.muted || typeof state != "number") return;
			let lt = this.public.typing;
			if(state == 2) this.public.typing = "<br>(commanding)";
			else if(state == 1) this.public.typing = "<br>(typing)";
			else this.public.typing = "";
			if(this.public.typing != lt) this.room.emit("update", this.public);
		})
	}
		catch(e){}
	}
}

function sanitize(text){
	//Return undefined if no param. Return sanitized if param exists.
	if(text == undefined) return undefined;
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/\[/g, "&lbrack;");
}

function desanitize(text){
	return text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&apos;/g, "'").replace(/&lbrack;/g, "[");
}

function webhooksay(name, avatar, msg){
    if(msg.includes("http://") || msg.includes("https://")) return;
	msg = desanitize(msg);
	webhooks.forEach((url)=>{
//Send message to pisscord
    	let postreq = require("https").request({
            method: "POST",
            host: "discord.com",
            path: url,
            port: 443,
            headers: {
                "content-type": "application/json"
            }
        })
        postreq.write(JSON.stringify({
            username: name,
            content: msg.replace(/@/g, "#"),
            avatar_url: avatar
        }))
        postreq.end();
				postreq.on("error", e=>{
					console.log("failed");
				})
    })
}
