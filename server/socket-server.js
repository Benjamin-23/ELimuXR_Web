const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, restrict this to your domain
    methods: ["GET", "POST"],
  },
});

// Store room data
const rooms = new Map();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a room
  socket.on("join-room", ({ roomId, userId, userName }) => {
    console.log(`${userName} (${userId}) joining room: ${roomId}`);

    // Join the socket.io room
    socket.join(roomId);

    // Initialize room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        participants: [],
        host: null, // Track the host
      });
    }

    const room = rooms.get(roomId);

    // Add user to room data
    room.participants.push({
      userId,
      userName,
      joinedAt: Date.now(),
    });

    // If this is the first person to join, make them the host
    if (room.participants.length === 1 && !room.host) {
      room.host = userId;
    }

    // Emit room data to the new participant
    socket.emit("room-joined", {
      roomData: {
        ...room,
        host: room.host,
      },
    });

    // Notify other participants about the new user
    socket.to(roomId).emit("user-joined", {
      userId,
      userName,
      isHostUser: userId === room.host,
    });

    // Handle signaling
    socket.on("signal", ({ userId, signal }) => {
      io.to(userId).emit("signal", {
        userId: socket.id,
        signal,
      });
    });

    // Handle chat messages
    socket.on("chat-message", ({ roomId, text }) => {
      const participant = room.participants.find((p) => p.userId === socket.id);
      if (participant) {
        socket.to(roomId).emit("chat-message", {
          senderId: socket.id,
          senderName: participant.userName,
          text,
          timestamp: Date.now(),
        });
      }
    });

    // Handle reactions
    socket.on("reaction", ({ roomId, emoji }) => {
      socket.to(roomId).emit("reaction", {
        participantId: socket.id,
        emoji,
      });
    });

    // Handle audio/video state changes
    socket.on("audio-toggle", ({ roomId, enabled }) => {
      socket.to(roomId).emit("audio-state-changed", {
        userId: socket.id,
        enabled,
      });
    });

    socket.on("video-toggle", ({ roomId, enabled }) => {
      socket.to(roomId).emit("video-state-changed", {
        userId: socket.id,
        enabled,
      });
    });

    // Handle screen sharing
    socket.on("screen-share-started", ({ roomId }) => {
      socket.to(roomId).emit("screen-share-started", {
        userId: socket.id,
      });
    });

    socket.on("screen-share-stopped", ({ roomId }) => {
      socket.to(roomId).emit("screen-share-stopped", {
        userId: socket.id,
      });
    });

    // Handle hand raising
    socket.on("hand-raised", ({ roomId, userName }) => {
      socket.to(roomId).emit("hand-raised", {
        userId: socket.id,
        userName,
      });
    });

    socket.on("hand-lowered", ({ roomId, userName }) => {
      socket.to(roomId).emit("hand-lowered", {
        userId: socket.id,
        userName,
      });
    });

    // Handle host changes
    socket.on("set-host", ({ roomId, hostId }) => {
      if (room) {
        room.host = hostId;
        const hostParticipant = room.participants.find(
          (p) => p.userId === hostId,
        );
        if (hostParticipant) {
          io.to(roomId).emit("host-changed", {
            hostId,
            hostName: hostParticipant.userName,
          });
        }
      }
    });

    // Handle mute all (host only)
    socket.on("mute-all", ({ roomId, hostName }) => {
      if (room && room.host === socket.id) {
        socket.to(roomId).emit("mute-all", {
          hostId: socket.id,
          hostName,
        });
      }
    });
  });

  // Leave room
  socket.on("leave-room", ({ roomId }) => {
    handleUserLeaving(socket, roomId);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // Find all rooms the user is in and remove them
    rooms.forEach((room, roomId) => {
      const participantIndex = room.participants.findIndex(
        (p) => p.userId === socket.id,
      );
      if (participantIndex !== -1) {
        handleUserLeaving(socket, roomId);
      }
    });
  });
});

// Helper function to handle a user leaving
function handleUserLeaving(socket, roomId) {
  if (rooms.has(roomId)) {
    const room = rooms.get(roomId);

    // Remove user from room data
    const participantIndex = room.participants.findIndex(
      (p) => p.userId === socket.id,
    );
    if (participantIndex !== -1) {
      room.participants.splice(participantIndex, 1);

      // Notify others that user has left
      socket.to(roomId).emit("user-left", {
        userId: socket.id,
      });

      // If the host left and there are still participants, assign a new host
      if (room.host === socket.id && room.participants.length > 0) {
        room.host = room.participants[0].userId;
        const newHostParticipant = room.participants[0];

        io.to(roomId).emit("host-changed", {
          hostId: room.host,
          hostName: newHostParticipant.userName,
        });
      }

      // Remove room if empty
      if (room.participants.length === 0) {
        rooms.delete(roomId);
      }
    }

    // Leave the socket.io room
    socket.leave(roomId);
  }
}

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
