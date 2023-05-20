import express, {Request, Response} from "express"
import mongoose from "mongoose"
import cors from "cors";
import bodyParser from 'body-parser'
import path from "path"

const Schema = mongoose.Schema
const todoSchema = new Schema({
    name: {type: String, required: true},
    done: {type: Boolean, required: true},
    className: {type: String, required: true}
})
const Todo: any = mongoose.model('todo model', todoSchema, 'my deals')

const app = express()

const corsMiddleware = cors()
app.use(corsMiddleware)

const jsonBodyMiddleware = bodyParser.json()
app.use(jsonBodyMiddleware)

const PORT = 3001

// Serve static files in the 'public' folder
// app.use(express.static(path.resolve(__dirname)));

//HOME PAGE
app.get('/', (req: Request, res: Response) => {
    //res.sendFile(__dirname + 'index.html')
    console.log('yes')
})

//GET ALL TODO
app.get('/todo', async (req: Request, res: Response) => {
    const result = await Todo.find({})
    res.send(result)
})

//POST TODO
app.post('/todo', async (req: Request, res: Response) => {
    const {name, done, className} = req.body
    try {
        const action = new Todo({
            name: name,
            done: done,
            className: className,
        })
        const newAction = new Todo(action);
        const result = await newAction.save();
        res.status(201).json(action)
    } catch {
        res.status(505).send('Server error')
    }
})

//DELETE TODO
app.delete('/todo', async (req: Request, res: Response) => {
    const name = req.body.name
    try {
        const result = await Todo.findOneAndDelete({name: name})
        res.sendStatus(204)
    } catch {
        res.status(505).send('Server error')
    }
})


//MARK TODO
app.post('/todo/done', async (req: Request, res: Response) => {
    const name = req.body.name
    try {
        const result = await Todo.findOneAndUpdate({name: name}, // filter object
            {done: true},      // update object
            {new: true})   // options object
        res.sendStatus(204)
    } catch {
        res.status(505).send('Server error')
    }
})


//CONNECT MONGODB
export async function connectToDB() {
    // mongodb://<username>:<password>@<host>:<port>/<database_name>
    const dbURL = 'mongodb+srv://Anton:QBgDZ7vVYskywK7d@cluster0.ksf3cyb.mongodb.net/?retryWrites=true&w=majority'
    try {
        await mongoose.connect(dbURL)
        console.log('Connected successfully to mongo server')
    } catch {
        console.log("Can't connect to db")
    }
}

//START APP
const startApp = async () => {
    await connectToDB()
    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`)
    })
}

//START APP
startApp();
