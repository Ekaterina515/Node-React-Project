import redis from "redis";

export const client = redis.createClient();

client.connect();

client.on("connect", () => {
  console.log(`[redis] connected`);
});

client.on("error", (error) => {
  console.log(`[redis] ${error}`);
});
