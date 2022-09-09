// create instances of mongoose, dotenv, mongoose modules
// instantiate our Express app
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// require mongoose model from TodoTask.js
const TodoTask = require("./models/TodoTask");

// configure dotenv (parse the .env file)
dotenv.config();

// allow access to CSS files; middleware for serving static files to our Express app
app.use("/static", express.static("public"));

// allows us to extract data from the form by adding it to body property of the request.
// here, urlencoded parses URL-encoded incoming requests with qs library.
app.use(express.urlencoded({ extended: true }));

// uses connection string stored in .env file to connect to our MongoDB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    // affirms successful connection to console
    console.log("Connected to db!");
    
    // moved app.listen inside call body so our server only runs after DB connection made
    app.listen(3000, () => console.log("Server Up and running"));
});

// [in tutorial code but deleted because deprecated]:
// (see https://mongoosejs.com/docs/migrating_to_6.html#mongoose-connect-returns-a-promise)
// mongoose.set("useFindAndModify", false);

// view engine configuration; use ejs files as templates
app.set("view engine", "ejs");

// GET method
app.get("/", (_, res) => {
    // finds, gets, renders existing to-do task data from our DB with styling template in
    // todo.ejs
    TodoTask.find({}, (_, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

// POST method
// uses async/await to simplify callback structure; awaits mongoose.save function (from
// instance of TodoTask) before continuing with app code.
app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
            res.redirect("/");
        }
        catch (err) {
            res.redirect("/");
        }
});

// UPDATE method
// allows to-do's to be editable; get existing task info and posts changes to DB
app
    .route("/edit/:id")

    .get((req, res) => {
        // get the ID of the to-do item
        const id = req.params.id;

        // render respective to-do task via styling template from todoEdit.ejs.
        TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        });
    })

    .post((req, res) => {
        // get the ID of the to-do item
        const id = req.params.id;

        //update our task in the DB via post using the method findByIdAndUpdate.
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });

// app.listen(3000, () => console.log("Server Up and running"));

// DELETE method
// allows to-do's to be deletable; remove items from DB via ID
app.route("/remove/:id").get((req, res) => {
    // get the ID of the to-do item
    const id = req.params.id;

    // update our DB using the method findByIdAndRemove
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});