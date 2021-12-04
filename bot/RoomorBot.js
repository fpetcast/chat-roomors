class RoomorBot {
    constructor(id) {
        this.id = id;
    }

    greetings() {
        return `Your socket connection ID:${this.id}`
    }
}

module.exports = RoomorBot;