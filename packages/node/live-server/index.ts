import LiveServer from "./src/live-server.ts";

const liveServer = new LiveServer();

liveServer.start();

setInterval(() => {
  console.log("I am alive! hahaha");
}, 1000);
