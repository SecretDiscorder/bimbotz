//base by DGXeon (Xeon Bot Inc.)
//YouTube: @DGXeon
//Instagram: unicorn_xeon13
//Telegram: t.me/xeonbotinc
//GitHub: @DGXeon
//WhatsApp: +916909137213
//want more free bot scripts? subscribe to my youtube channel: https://youtube.com/@DGXeon

require('./settings')
const SpottyDL = require('spottydl');

const archiver = require('archiver');
const express = require("express");
const app = express();
const qrcode = require('qrcode-terminal');
const math = require('mathjs');

const ytdl = require('ytdl-core');
const moment = require('moment-timezone');

const JSDOM = require('jsdom');


const Downloader = require('nodejs-file-downloader');

const config = require('./config.json');

var quranAyats = require('@kmaslesa/quran-ayats');

const JsFileDownloader = require('js-file-downloader');
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await, sleep, reSize } = require('./lib/myfunc')
const { default: XeonBotIncConnect, delay, PHONENUMBER_MCC, makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = require("@whiskeysockets/baileys")
const NodeCache = require("node-cache")
const Pino = require("pino")
const readline = require("readline")
const { parsePhoneNumber } = require("libphonenumber-js")
const makeWASocket = require("@whiskeysockets/baileys").default

const store = makeInMemoryStore({
    logger: pino().child({
        level: 'silent',
        stream: 'store'
    })
})

let phoneNumber = "916909137213"
let owner = JSON.parse(fs.readFileSync('./database/owner.json'))

const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
         
async function startXeonBotInc() {
//------------------------------------------------------
let { version, isLatest } = await fetchLatestBaileysVersion()
const {  state, saveCreds } =await useMultiFileAuthState(`./session`)
    const msgRetryCounterCache = new NodeCache() // for retry message, "waiting message"
    const XeonBotInc = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode, // popping up QR in terminal log
      browser: [ "Ubuntu", "Chrome", "20.0.04" ], // for this issues https://github.com/WhiskeySockets/Baileys/issues/328
     auth: {
         creds: state.creds,
         keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
      },
      markOnlineOnConnect: true, // set false for offline
      generateHighQualityLinkPreview: true, // make high preview link
      getMessage: async (key) => {
         let jid = jidNormalizedUser(key.remoteJid)
         let msg = await store.loadMessage(jid, key.id)

         return msg?.message || ""
      },
      msgRetryCounterCache, // Resolve waiting messages
      defaultQueryTimeoutMs: undefined, // for this issues https://github.com/WhiskeySockets/Baileys/issues/276
   })
   
   store.bind(XeonBotInc.ev)

    // login use pairing code
   // source code https://github.com/WhiskeySockets/Baileys/blob/master/Example/example.ts#L61
   if (pairingCode && !XeonBotInc.authState.creds.registered) {
      if (useMobile) throw new Error('Cannot use pairing code with mobile api')

      let phoneNumber
      if (!!phoneNumber) {
         phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

         if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
            console.log(chalk.bgBlack(chalk.redBright("Start with country code of your WhatsApp Number, Example : +916909137213")))
            process.exit(0)
         }
      } else {
         phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number 😍\nFor example: +916909137213 : `)))
         phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

         // Ask again when entering the wrong number
         if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
            console.log(chalk.bgBlack(chalk.redBright("Start with country code of your WhatsApp Number, Example : +916909137213")))

            phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number 😍\nFor example: +916909137213 : `)))
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
            rl.close()
         }
      }

      setTimeout(async () => {
         let code = await XeonBotInc.requestPairingCode(phoneNumber)
         code = code?.match(/.{1,4}/g)?.join("-") || code
         console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)))
      }, 3000)
   }

    XeonBotInc.ev.on('messages.upsert', async chatUpdate => {
        console.log(JSON.stringify(chatUpdate, undefined, 2))
        try {
            const mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast' )
            if (!XeonBotInc.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
            if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
            const m = smsg(XeonBotInc, mek, store)
            
        const from = m.key.remoteJid
            require("./XeonBug4")(XeonBotInc, m, chatUpdate, store)
                  const msg = chatUpdate.messages[0];
      if (!msg || !msg.message || !msg.message.conversation) {
	console.error("Invalid message format");
	return;
      }
                  const args = msg.message.conversation.split(' ');
      const cmd = args[0];
	  
      const cmdRegex = /^!quran\s*(\d+)\s*(\d+)?\s*(juz\s*(\d+))?$/i;
 
      const match = msg.message.conversation.match(cmdRegex);
			      const allAyats = quranAyats.getAllAyats();

      fs.writeFileSync('ayat.json', JSON.stringify(allAyats));



      // Fungsi sendQuranVerse diperbaiki

      async function sendQuranVerse(ayahNumber, surahNumber) {

        try {



          // Mendapatkan ayat Al-Quran berdasarkan nomor surah dan a

          const ayatData = JSON.parse(fs.readFileSync('ayat.json', 'utf8'));



          // Temukan ayat berdasarkan ayahNumber dan surahNumber.

          const ayah = ayatData.find(ayah => ayah.ayaNumber === ayahNumber && ayah.sura === surahNumber);



          if (ayah) {

            const response = `Surah ${surahNumber}, Ayah ${ayahNumber}: ${ayah.aya}`;

            await XeonBotInc.sendMessage(from, {

              text: response

            });

          } else {

            // Teks yang akan dikirim jika ayat tidak ditemukan.

            const notFoundResponse = "Ayat tidak ditemukan dalam database.";

            await XeonBotInc.sendMessage(from, {

              text: notFoundResponse

            });

          }

        } catch (error) {

          console.error(error);

          await XeonBotInc.sendMessage(from, {

            text: `Terjadi kesalahan: ${error.message}`

          });

        }

      }

      async function detailYouTube(url) {

        await XeonBotInc.sendMessage(from, {

          text: '[⏳] Loading..'

        });

        try {

          let info = await ytdl.getInfo(url);

          let data = {

            channel: {

              name: info.videoDetails.author.name,

              user: info.videoDetails.author.user,

              channelUrl: info.videoDetails.author.channel_url,

              userUrl: info.videoDetails.author.user_url,

              verified: info.videoDetails.author.verified,

              subscriber: info.videoDetails.author.subscriber_count,

            },

            video: {

              title: info.videoDetails.title,

              description: info.videoDetails.description,

              lengthSeconds: info.videoDetails.lengthSeconds,

              videoUrl: info.videoDetails.video_url,

              publishDate: info.videoDetails.publishDate,

              viewCount: info.videoDetails.viewCount,

            },

          };

          await XeonBotInc.sendMessage(from, `*CHANNEL DETAILS*\n• Name : ${data.channel.name}\n• User : ${data.channel.user}\n• Verified : ${data.channel.verified}\n• Channel : ${data.channel.channelUrl}\n• Subscriber : ${data.channel.subscriber}`);

          await XeonBotInc.sendMessage(from, `*VIDEO DETAILS*\n• Title : ${data.video.title}\n• Seconds : ${data.video.lengthSeconds}\n• VideoURL : ${data.video.videoUrl}\n• Publish : ${data.video.publishDate}\n• Viewers : ${data.video.viewCount}`)

          await XeonBotInc.sendMessage(from, '*[✅]* Successfully!');

        } catch (err) {

          console.log(err);

          await XeonBotInc.sendMessage(from, '*[❎]* Failed!');

        }

      }



      async function downloadYouTube(url, format, filter) {

        await XeonBotInc.sendMessage(from, {

          text: '[⏳] Loading..'

        });

        let timeStart = Date.now();

        try {

          let info = await ytdl.getInfo(url);

          let data = {

            channel: {

              name: info.videoDetails.author.name,

              user: info.videoDetails.author.user,

              channelUrl: info.videoDetails.author.channel_url,

              userUrl: info.videoDetails.author.user_url,

              verified: info.videoDetails.author.verified,

              subscriber: info.videoDetails.author.subscriber_count,

            },

            video: {

              title: info.videoDetails.title,

              description: info.videoDetails.description,

              lengthSeconds: info.videoDetails.lengthSeconds,

              videoUrl: info.videoDetails.video_url,

              publishDate: info.videoDetails.publishDate,

              viewCount: info.videoDetails.viewCount,

            },

          };

          ytdl(url, {

            filter: filter,

            format: format,

            quality: 'highest'

          }).pipe(fs.createWriteStream(`./download.${format}`)).on('finish', async () => {

            let timestamp = Date.now() - timeStart;

            const media = {

              "filename": `download.${format}`

            };





            media.filename = `${config.filename.mp3}.${format}`;

            await XeonBotInc.sendMessage(from, {

              audio: {

                url: 'download.mp3'

              },

              mimetype: 'audio/mp4'

            });

            await XeonBotInc.sendMessage(from, {

              text: `• Title : ${data.video.title}\n• Channel : ${data.channel.user}\n• View Count : ${data.video.viewCount}\n• TimeStamp : ${timestamp}`

            });

            await XeonBotInc.sendMessage(from, {

              text: '*[✅]* Successfully!'

            });

          });

        } catch (err) {

          console.log(err);

          await XeonBotInc.sendMessage(from, '*[❎]* Failed!');

        }

      }

      switch (cmd) {
case '!spotify':
		  try{
    const folderName = 'output';

    if (args.length !== 2) {
        XeonBotInc.sendMessage(from, { text: 'Format yang benar: !spotify [URL]' });
        return;
    } else {

    const spotifyUrl = args[1];

    await XeonBotInc.sendMessage(from, {
        text: '[⏳] Loading..'
    });

    let track;

    try {
        track = await SpottyDL.getTrack(spotifyUrl);
    } catch (error) {
        console.error("Error:", error);
        throw new Error("Unduhan gagal");
    }

    const outputPath = `./${folderName}`;

    if (track && typeof track === "object") {
        await SpottyDL.downloadTrack(track, outputPath);

        // Mengganti nama file hasil unduhan menjadi "spotify.mp3"
        const files = fs.readdirSync(outputPath);
        files.forEach(file => {
            const oldFilePath = `${outputPath}/${file}`;
            const newFilePath = `${outputPath}/spotify.mp3`;
            fs.renameSync(oldFilePath, newFilePath);
        });

        // Kirim file audio ke pengguna
        const fileUrl = `${outputPath}/spotify.mp3`;
        await XeonBotInc.sendMessage(from, {
            audio: {
                url: fileUrl
            },
            mimetype: 'audio/mp4'
        });
    } else {
        console.log("Response is not a valid object:", track);
    }
      }
		  }
		  catch (error){
		  }
    
    break;



          case '!virtex':

    if (args.length !== 3) {

        XeonBotInc.sendMessage(from, {

            text: 'Format yang benar: !virtex (string)'

        });

    } else {

        const c = args[1];

        const b = parseInt(args[2]);

        try {

            XeonBotInc.sendMessage(from, {

                text: c.repeat(b)

            });

        } catch (error) {

            XeonBotInc.sendMessage(from, {

                text: 'Terjadi kesalahan dalam membuat virtex'

            });

        }

    }

    break;



        case '!quran':

          if (args.length === 3) {

            const surahNumber = parseInt(args[1]);

            const ayahNumber = parseInt(args[2]);

            if (!isNaN(surahNumber) && !isNaN(ayahNumber)) {

              await sendQuranVerse(ayahNumber, surahNumber);

            } else {

              await XeonBotInc.sendMessage(from, {

                text: 'Nomor surah dan ayat harus berupa angka.'

              });

            }

          } else {

            await XeonBotInc.sendMessage(from, {

              text: 'Format yang benar: !quran [Nomor Surah] [Nomor Ayat]'

            });

          }


    // Get the current time in the specified time zone

    break;




        case '!calculate':

          const expression = args.slice(1).join(' ');

          const result = math.evaluate(expression);

          XeonBotInc.sendMessage(from, { text: `Hasil: ${result}` });

          break;



        case '!aritmatika':

          if (args.length !== 4) {

            XeonBotInc.sendMessage(from, {

              text: 'Format yang benar: !aritmatika [a] [n] [d]'

            });

            return;

          }

          const a = parseFloat(args[1]);

          const n = parseFloat(args[2]);

          const d = parseFloat(args[3]);

          const nthTerm = a + (n - 1) * d;

          XeonBotInc.sendMessage(from, { text: `Suku ke-${n} dari barisan aritmatika dengan a=${a} dan d=${d} adalah ${nthTerm}` });

          break;



        case '!sin':

          if (args.length !== 2) {

            XeonBotInc.sendMessage(from, {

              text: 'Format yang benar: !sin [sudut]'

            });

            return;

          }

          const sudutSin = parseFloat(args[1]);

          try {

            const resultSin = math.sin(sudutSin);

            XeonBotInc.sendMessage(from, { text: `sin(${sudutSin} radian): ${resultSin}` });

          } catch (error) {

            XeonBotInc.sendMessage(from, { text: 'Terjadi kesalahan dalam perhitungan sin.' });

          }

          break;



        case '!cos':

          if (args.length !== 2) {

            XeonBotInc.sendMessage(from, { text: 'Format yang benar: !cos [sudut]' });

            return;

          }

          const sudutCos = parseFloat(args[1]);

          try {

            const resultCos = math.cos(sudutCos);

            XeonBotInc.sendMessage(from, { text: `cos(${sudutCos} radian): ${resultCos}` });

          } catch (error) {

            XeonBotInc.sendMessage(from, { text: 'Terjadi kesalahan dalam perhitungan cos.' });

          }

          break;



        case '!tan':

          if (args.length !== 2) {

            XeonBotInc.sendMessage(from, { text: 'Format yang benar: !tan [sudut]' });

            return;

          }

          const sudutTan = parseFloat(args[1]);

          try {

            const resultTan = math.tan(sudutTan);

            XeonBotInc.sendMessage(from, { text: `tan(${sudutTan} radian): ${resultTan}` });

          } catch (error) {

            XeonBotInc.sendMessage(from, { text: 'Terjadi kesalahan dalam perhitungan tan.' });

          }

          break;



        case '!pangkat':

          if (args.length !== 3) {

            XeonBotInc.sendMessage(from, { text: 'Format yang benar: !pangkat [basis] [eksponen]' });

            return;

          }

          const basis = parseFloat(args[1]);

          const eksponen = parseFloat(args[2]);

          try {

            const resultPow = math.pow(basis, eksponen);

            XeonBotInc.sendMessage(from, { text: `Hasil pangkat dari ${basis}^${eksponen}: ${resultPow}` });

          } catch (error) {

            XeonBotInc.sendMessage(from, { text: 'Terjadi kesalahan dalam perhitungan pangkat.' });

          }

          break;



        case '!sqrt':

          try {

          if (args.length !== 2) {

            XeonBotInc.sendMessage(from, { text: 'Format yang benar: !sqrt [angka]' });

            return;

          }

          const angkaSqrt = parseFloat(args[1]);

          if (!isNaN(angkaSqrt)) {

            const resultSqrt = math.sqrt(angkaSqrt);

            XeonBotInc.sendMessage(from, { text: `Akar kuadrat dari ${angkaSqrt}: ${resultSqrt}` });

          } else {

            XeonBotInc.sendMessage(from, { text: 'Masukkan angka yang valid.' });

          }
		   } catch (error) {

            XeonBotInc.sendMessage(from, { text: 'Terjadi kesalahan dalam perhitungan tan.' });

		   }

          break;

case '!youtube':

          if (args.length !== 2) {

            XeonBotInc.sendMessage(from, { text: 'Format yang benar: !youtube [URL]' });

            return;

          }

          const url = args[1];

          await detailYouTube(url);

          break;



        case 'download':

          if (args.length !== 4) {

            XeonBotInc.sendMessage(from, { text: 'Format yang benar: !download [URL] [format] [filter]' });

            return;

          }

          const downloadUrl = args[1];

          const format = args[2];

          const filter = args[3];

          await downloadYouTube(downloadUrl, format, filter);

          break;



    

case '!spam':
        if (args.length != 3) {
          await XeonBotInc.sendMessage(from, {
            text: 'Format yang benar !spam {string} [1]'
          });
        } else {
          const c = args[1];
          const b = parseInt(args[2]);
          while (b > 0) {
            try {
              await XeonBotInc.sendMessage(from, {
                text: c.repeat(b)

              })
            } catch (error) {
              console.log(error)
            }
          }
        }
		break;
case '!atur':
        if (args.length != 3) {
          await XeonBotInc.sendMessage(from, {
            text: 'Format yang benar !spam {string} [1]'
          });
        } else {
          const c = args[1];
          const b = parseInt(args[2]);
            try {
              await XeonBotInc.sendMessage(from, {
                text: c.repeat(b)

              })
            } catch (error) {
              console.log(error)
            }
        }
     
break;
}
        } catch (err) {
            console.log(err)
        }
    })
    
    //autostatus view
        XeonBotInc.ev.on('messages.upsert', async chatUpdate => {
        	if (global.autoswview){
            mek = chatUpdate.messages[0]
            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
            	await XeonBotInc.readMessages([mek.key]) }
            }
    })

   
    XeonBotInc.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    XeonBotInc.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = XeonBotInc.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = {
                id,
                name: contact.notify
            }
        }
    })

    XeonBotInc.getName = (jid, withoutContact = false) => {
        id = XeonBotInc.decodeJid(jid)
        withoutContact = XeonBotInc.withoutContact || withoutContact
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = XeonBotInc.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
                id,
                name: 'WhatsApp'
            } : id === XeonBotInc.decodeJid(XeonBotInc.user.id) ?
            XeonBotInc.user :
            (store.contacts[id] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }
    
    XeonBotInc.public = true

    XeonBotInc.serializeM = (m) => smsg(XeonBotInc, m, store)

XeonBotInc.ev.on("connection.update",async  (s) => {
        const { connection, lastDisconnect } = s
        if (connection == "open") {
        	console.log(chalk.magenta(` `))
            console.log(chalk.yellow(`🌿Connected to => ` + JSON.stringify(XeonBotInc.user, null, 2)))
			await delay(1999)
            console.log(chalk.yellow(`\n\n                  ${chalk.bold.blue(`[ ${botname} ]`)}\n\n`))
            console.log(chalk.cyan(`< ================================================== >`))
	        console.log(chalk.magenta(`\n${themeemoji} YT CHANNEL: Xeon`))
            console.log(chalk.magenta(`${themeemoji} GITHUB: DGXeon `))
            console.log(chalk.magenta(`${themeemoji} INSTAGRAM: @unicorn_xeon13 `))
            console.log(chalk.magenta(`${themeemoji} WA NUMBER: ${owner}`))
            console.log(chalk.magenta(`${themeemoji} CREDIT: ${wm}\n`))
        }
        if (
            connection === "close" &&
            lastDisconnect &&
            lastDisconnect.error &&
            lastDisconnect.error.output.statusCode != 401
        ) {
            startXeonBotInc()
        }
    })
    XeonBotInc.ev.on('creds.update', saveCreds)
    XeonBotInc.ev.on("messages.upsert",  () => { })

    XeonBotInc.sendText = (jid, text, quoted = '', options) => XeonBotInc.sendMessage(jid, {
        text: text,
        ...options
    }, {
        quoted,
        ...options
    })
    XeonBotInc.sendTextWithMentions = async (jid, text, quoted, options = {}) => XeonBotInc.sendMessage(jid, {
        text: text,
        mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
        ...options
    }, {
        quoted
    })
    XeonBotInc.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }

        await XeonBotInc.sendMessage(jid, {
            sticker: {
                url: buffer
            },
            ...options
        }, {
            quoted
        })
        return buffer
    }
    XeonBotInc.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options)
        } else {
            buffer = await videoToWebp(buff)
        }

        await XeonBotInc.sendMessage(jid, {
            sticker: {
                url: buffer
            },
            ...options
        }, {
            quoted
        })
        return buffer
    }
    XeonBotInc.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        let type = await FileType.fromBuffer(buffer)
        trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        // save to file
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }

    XeonBotInc.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }

        return buffer
    }
    }
return startXeonBotInc()

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})

process.on('uncaughtException', function (err) {
let e = String(err)
if (e.includes("conflict")) return
if (e.includes("Socket connection timeout")) return
if (e.includes("not-authorized")) return
if (e.includes("already-exists")) return
if (e.includes("rate-overlimit")) return
if (e.includes("Connection Closed")) return
if (e.includes("Timed Out")) return
if (e.includes("Value not found")) return
console.log('Caught exception: ', err)
})