import express from "express";
import redis from "redis";
import axios from "axios";

const redisClient = redis.createClient();
const DEFAULT_EXPIRATION_SECONDS = 60;
await redisClient.connect();

const app = express();
app.use(express.json());

app.get("/photos", async (req, res) => {
    const albumId = req.query.albumId;
    console.log("Reached here");

    const token = await redisClient.get("data");
    if (token != null) {
        return res.json({
            "response": token
        });
    } else {
        const { data } = await axios.get(
            "https://jsonplaceholder.typicode.com/photos",
            { params: { albumId } }
        )

        // redisClient.setEx('photos', JSON.stringify(data),); // Can only store the strings in redis
        await redisClient.set("data", JSON.stringify(data), { EX: DEFAULT_EXPIRATION_SECONDS });

        res.json({
            data
        });
    }
});

app.listen(3000, () => {
    console.log("http://localhost:3000");
});
