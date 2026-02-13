const Pusher = require("pusher");

const pusher = new Pusher({
    appId: "2115022",
    key: "2115022a83bccae41f444bc75ae",
    secret: "9be9d863def5261edcfa",
    cluster: "ap2",
    useTLS: true,
});

export default async function handler(req, res) {
    const { text, senderId } = JSON.parse(req.body);

    await pusher.trigger("public-chat", "message-event", {
        text,
        senderId,
    });

    res.status(200).json({ sent: true });
}