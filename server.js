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

    redisClient.get("photos", (error, photos) => {
        console.log("Inside the redis get");

        console.log(photos);
        if (photos != null) {
            console.log("Returned from cache");
            return res.json(JSON.parse(photos));
        } else {
            console.log("There is nothing like that here");
        }
    });

    console.log("Skipping the redis part eh?");
    const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/photos",
        { params: { albumId } }
    )

    redisClient.setEx('photos', DEFAULT_EXPIRATION_SECONDS, JSON.stringify(data)); // Can only store the strings in redis
    res.json(data);
});



app.listen(3000, () => {
    console.log("http://localhost:3000");
});
