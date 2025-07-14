export default class MessageSession {
    uuid
    name
    message

    constructor(uuid, name, message) {
        this.uuid = uuid;
        this.name = name;
        this.message = message;
    }
}