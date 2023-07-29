require('dotenv').config()
const express = require("express")
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"]
	}
});

app.use(cors());
app.use(express.json());

const PORT = 5000;

io.on("connection", (socket) => {
	console.log('connected', socket.id);
	socket.emit("me", socket.id);

	socket.on("callUser", ({ userToCall, signalData, from }) => {
		io.to(userToCall).emit("incomingCall", { signal: signalData, from });
	});

	socket.on("answerCall", ({ signalData, idFromCall }) => {
		io.to(idFromCall).emit("callAccepted", { signal: signalData })
	});

	socket.on("callEnded", (id) => {
		io.to(id).emit("callEnded");
	})

	socket.on("codeChange", ({ html, css, js, from }) => {
		io.to(from).emit("codeChange", { html, css, js })
	})

	socket.on("disconnect", () => {
		connectedUsers.delete(socket.session.user.id)
	})
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));