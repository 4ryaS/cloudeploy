import { createClient } from "redis";
import 'dotenv/config';
import { error } from "console";

const publisher = createClient({
    url: process.env.REDIS_URL
});
publisher.on('error', () => {
    console.log(error);
})
publisher.connect();

export const pushToRedis = async (id: string) => {
    await publisher.lPush('buildQueue', id);
}

