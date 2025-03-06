const { Telegraf } = require('telegraf');
const fs = require('fs');
require('dotenv').config();

const { BOT_TOKEN } = process.env;  

const ADMIN_ID = Number(process.env.ADMIN_ID);



const bot = new Telegraf(BOT_TOKEN);
const wishlist = JSON.parse(fs.readFileSync('wishlist.json', 'utf8'))
bot.start((ctx) => ctx.reply('Your wish-list that you can change'));

bot.command('wishlist', (ctx) =>{
    const gifts = wishlist.map((gift, index) => {
        const bought = gift.boughtBy 
        ? `(will be bought by ${gift.boughtBy})`
        : `(nobody bought)`
        const row = `${index + 1}. ${gift.title} ${bought}`;
        return row;  
    });
    ctx.reply(`list of all gifts:\n${gifts.join('\n')}`);   
});

bot.command('add', (ctx) =>{
    if(ctx.from.id !== ADMIN_ID){
        ctx.reply('You can not add any gift in this wish-list')
        return;
    }
    const giftTitle = ctx.message.text
    .split(' ')
    .slice(1)
    .join(' ');
    const gift = {title: giftTitle, boughtBy: null};
    wishlist.push(gift);
    fs.writeFileSync(
    'wishlist.json', 
    JSON.stringify(wishlist, null, 2),  
    'utf8'
    );
    ctx.reply(
        `Gift ${giftTitle} was succsessfully added`, 
    );
});

bot.command('delete', (ctx) =>{
    if(ctx.from.id !== ADMIN_ID){
        ctx.reply('You can not delete any gift from this wish-list')
        return;
    }
    const giftIndex = Number(ctx.message.text.split(" ")[1]);
    const [deletedGift] = wishlist.splice(giftIndex -1, 1)
    fs.writeFileSync(
        'wishlist.json', 
        JSON.stringify(wishlist, null, 2),  
        'utf8'
        );
    ctx.reply(`Gift ${deletedGift.title} successfully deleted`);
});

bot.command('buy', (ctx) =>{
    const giftIndex = Number(ctx.message.text.split(" ")[1]);
    wishlist[giftIndex -1].boughtBy = ctx.from.username;
    fs.writeFileSync(
        'wishlist.json', 
        JSON.stringify(wishlist, null, 2),  
        'utf8'
    );
    ctx.reply(`Gift  ${
        wishlist[giftIndex -1].title
        } will be bought by ${ctx.from.username}`, 
    )
});

bot.launch();


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));