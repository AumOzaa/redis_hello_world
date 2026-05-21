import express from "express";
import redis from "redis";
import axios from "axios";

const app = express();
app.use(express.json());

let redisClient;

(async () => {
    redisClient = redis.createClient({
        host: 'redis-server',
        port: 6379
    });

    redisClient.on("error", (error) => console.log(`Error: ${error}`));

    await redisClient.connect();
})();

async function fetchApiData(todoId) {
    const apiResponse = await axios.get(`https://jsonplaceholder.typicode.com/todos/${todoId}`);
    console.log("Request sent to the API");
    return apiResponse.data;
}



app.get("/todos/:todoId", async (req, res) => {
    const todoId = req.params.todoId;
    let results;

    let isCached = false;

    try {
        const cachedResult = await redisClient.get(todoId);
        if (cachedResult) {
            isCached = true;
            results = JSON.parse(cachedResult);
        } else {
            results = await fetchApiData(todoId);
            await redisClient.set(todoId, JSON.stringify(results), {
                EX: 120, // Time in seconds to live
                NX: true // Update cache if key is not there
            });
        }

        res.send({
            "fromCached": isCached,
            "data": results
        });

    } catch (error) {
        console.log(error);
        res.status(404).send("Data unavailable");
    }
});

app.listen(3000, () => {
    console.log("http://localhost:3000");
})
