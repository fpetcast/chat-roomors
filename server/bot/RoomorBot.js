const Enum = require('../utils/enum')
const moment = require('moment')

class RoomorBot {
    constructor(name) {
        this.name = name;
    }

    greetings(username) {
        return this.sendMsg(`Hi ${username}! Welcome to CHAT ROOMORS`)
    }

    alertUsers(type, username) {
        switch (type) {
            case Enum.JOIN:
                return this.sendMsg(`${username} joined the chat`);
                break;
            case Enum.LEFT:
                    return this.sendMsg(`${username} left the chat`);
                    break;
            default:
                break;
        }
    }

    sendMsg(text) {
        return {
            time: moment().format('h:mm a'),
            text: text,
            user: this.name
        }
    }

    formatDate(date) {
        return date.toLocaleString('it-IT', { hour: 'numeric', hour12: true });
    }

    elaborateMeta(meta) {
        console.log(meta);
        let msg
        let metaKey
        let metaArgs
        let start
        let end

        if (meta.includes('(') && meta.includes(')')) {
            start = meta.indexOf('(');
            end = meta.indexOf(')')
            metaKey = meta.slice(1, start).toLowerCase()
            metaArgs = meta.slice(start + 1, end).replace(/\s+/g, '');
            console.log(metaArgs.split(','));
        } else {
            metaKey = meta.slice(1).toLowerCase()
        }
        
        console.log(metaKey);

        switch (metaKey) {
            case Enum.METAVOTE:
                return metaArgs.split(',');
            default:
                msg = this.formattedRes(Enum.METACODE_ERR)
                return msg;
            break;
        }

    }

    formattedRes(code) {
        let res

        if (code == Enum.METACODE_ERR) {
            res = 'This meta is invalid';
        }

        return res
    }
}

module.exports = RoomorBot;