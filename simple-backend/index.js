const express = require("express");

const app = express();
app.use(express.json());
const port = process.env.PORT || 3001;
const chatTitles = [
  "Project planning",
  "Weekend ideas",
  "Book recommendations",
  "Travel plans",
  "Quick question",
  "Team updates",
  "Recipe exchange",
  "Learning goals",
  "Design feedback",
  "General discussion",
];

app.post("/api/v1/chat", (request, response) => {
  setTimeout(() => {
    response.json({
      chatId: Math.floor(Math.random() * 10) + 1,
      message: request.body.message,
    });
  }, 250);
});

app.get("/api/v1/chat-list", (_request, response) => {
  const chats = chatTitles.map((title, index) => ({
    chatId: index + 1,
    title: chatTitles[Math.floor(Math.random() * chatTitles.length)],
  }));

  response.json(chats);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
