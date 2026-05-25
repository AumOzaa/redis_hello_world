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
    console.log(`AlbumId ${albumId}`);

    const cacheKey = `AlbumId${albumId}`;
    console.log(cacheKey);

    var cacheData = await redisClient.get(cacheKey);
    if (cacheData != null) {
        cacheData = JSON.parse(cacheData);
        return res.json({
            "response": cacheData
        });
    } else {
        const { data } = await axios.get(
            "https://jsonplaceholder.typicode.com/photos",
            { params: { albumId } }
        )

        console.log(data);

        // redisClient.setEx('photos', JSON.stringify(data),); // Can only store the strings in redis
        await redisClient.set(cacheKey, JSON.stringify(data), { EX: DEFAULT_EXPIRATION_SECONDS });

        res.json({
            data
        });
    }
});

app.listen(3000, () => {
    console.log("http://localhost:3000");
});
