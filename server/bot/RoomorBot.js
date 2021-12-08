const Enum = require('../utils/enum')

class RoomorBot {
    constructor(id) {
        this.id = id;
    }

    greetings() {
        return `Your socket connection ID:${this.id}`
    }

    alertUsers(type) {
        switch (type) {
            case Enum.JOIN:
                return 'A user joined the chat';
                break;
            case Enum.LEFT:
                    return 'A user left the chat';
                    break;
            default:
                break;
        }
    }
}

module.exports = RoomorBot;