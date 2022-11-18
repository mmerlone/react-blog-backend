import express from "express";
import { db, connectToDb} from './db.js';

const app = express();
app.use(express.json());

app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;

    const article = await db.collection('articles').findOne({ name });

    if(article){
        res.json(article);
    }else{
        res.sendStatus(404).send('Article not found');
    }
});

app.put('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params;
    
    await db.collection('articles').updateOne({ name }, {
        $inc: { upvotes: 1 },
    });
    const article = await db.collection('articles').findOne({ name });

    if(article){
        res.json(article)
    }else{
        res.send(`No article by that name "${name}"...`);
    }
});

app.post('/api/articles/:name/comments', async (req, res) => {
    const { name } = req.params;
    const { postedBy, text } = req.body;
    
    await db.collection('articles').updateOne({ name }, {
        $push: { comments: { postedBy, text} },
    });
    const article = await db.collection('articles').findOne({ name });

    if(article) {
        res.json(article)
    }else{
        res.send(`No article by that name "${name}"...`);
    }
});

connectToDb(() => {
    console.log('Connected to DB.');
    app.listen(8080, () => {
        console.log('Port 8080');
    })
})
