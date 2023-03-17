const express = require('express'),
      morgan = require('morgan'),
      fs = require('fs'),
      path = require('path'),
      bodyParser=require('body-parser'),
      uuid=require('uuid'),
      mongoose = require('mongoose'),
      Models = require('./models.js');

const app = express();

const { check, validationResult } = require('express-validator');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://127.0.0.1:27017/MyMovieDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors()); //allows requests from all origins


//to give access to only certain origins
// let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

// app.use(cors({
//   origin: (origin, callback) => {
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
//       let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
//       return callback(new Error(message ), false);
//     }
//     return callback(null, true);
//   }
// }));


//importing auth.js file
let auth = require('./auth')(app);

//importing passport.js file
const passport = require('passport');
require('./passport');

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"),{flags: 'a'})

app.use(morgan('common', {stream: accessLogStream}));
app.use(express.static('public'));

let topTenMovies = [
    {
        title: 'The Lord of the Rings: The Return of the King', 
        description: 'Continuing the plot of the previous film, Frodo, Sam and Gollum are making their final way toward Mount Doom in Mordor in order to destroy the One Ring, unaware of Gollum\'s true intentions, while Merry, Pippin, Gandalf, Aragorn, Legolas, Gimli and the rest are joining forces together against Sauron and his legions in Minas Tirith.',
        genre: 
        {
            name: 'fantasy',
            description: 'Fantasy films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds.'
        },
        director: 
        {
            name: 'Peter Jackson',
            bio: 'Sir Peter Robert Jackson is a New Zealand film director, screenwriter and producer.',
            Birthyear: '1961'
        },
        imageUrl: 'https://pixabay.com/images/id-2021410/',
        year: '2003',
        featured: 'yes'
    },
    {
        title: 'Inception', 
        description: 'The film stars Leonardo DiCaprio as a professional thief who steals information by infiltrating the subconscious of his targets.',
        genre: {
            name: 'science fiction',
            description: 'Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, dinosaurs, interstellar travel, time travel, or other technologies.'
        },
        director: 
        {
            name: 'Christopher Nolan',
            bio: 'Christopher Edward Nolan is a British-American filmmaker who is known for his Hollywood blockbusters with complex storytelling, Nolan is considered a leading filmmaker of the 21st century.',
            Birthyear: '1970'
        },
        imageUrl: 'https://pixabay.com/images/id-3265473/',
        year: '2010',
        featured: 'yes'
    },
    {
        title: 'Spirited Away', 
        description: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.',
        genre: {
            name: 'anime',
            description: 'Anime is a style of animation originating in Japan that is characterized by stark colorful graphics depicting vibrant characters in action-filled plots often with fantastic or futuristic themes.'
        },
        director: 
        {
            name: 'Hayao Miyazaki',
            bio: 'Hayao Miyazaki is a Japanese animator, director, producer, screenwriter, author, and manga artist.',
            Birthyear: '1941'
        },
        imageUrl: 'https://pixabay.com/images/id-1754734/',
        year: '2001',
        featured: 'yes'
    },
    {
        title: 'The Prestige', 
        description: 'The Prestige is based on the 1995 novel by Christopher Priest. It follows Robert Angier and Alfred Borden, rival stage magicians in Victorian London who feud over a perfect teleportation trick.',
        genre: {
            name: 'thriller',
            description: 'Thriller is a genre of fiction with numerous, often overlapping, subgenres, including crime, horror and detective fiction.'
        },
        director: 
        {
            name: 'Christopher Nolan',
            bio: 'Christopher Edward Nolan is a British-American filmmaker who is known for his Hollywood blockbusters with complex storytelling, Nolan is considered a leading filmmaker of the 21st century.',
            Birthyear: '1970'
        },
        imageUrl: 'https://pixabay.com/images/id-233171/',
        year: '2006',
        featured: 'yes'
    },
    {
        title: 'Pirates of the Caribbean: The Curse of the Black Pearl',
        description: 'Blacksmith Will Turner teams up with eccentric pirate "Captain" Jack Sparrow to save his love, the governor\'s daughter, from Jack\'s former pirate allies, who are now undead.',
        genre: {
            name: 'action',
            description: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
        },
        director: 
        {
            name: 'Gore Verbinski',
            bio: 'Gregor Justin "Gore" Verbinski is an American film director, screenwriter, producer, and musician.',
            Birthyear: '1964'
        },
        imageUrl: 'https://images.app.goo.gl/Q6KMpFhvACebtH2PA',
        year: '2003',
        featured: 'yes'
    },
    {
        title: 'Coco', 
        description: 'Aspiring musician Miguel, confronted with his family\'s ancestral ban on music, enters the Land of the Dead to find his great-great-grandfather, a legendary singer.',
        genre: {
            name: 'musical',
            description: 'Musical film is a film genre in which songs by the characters are interwoven into the narrative, sometimes accompanied by dancing.'
        },
        director: 
        {
            name: 'Lee Unkrich',
            bio: 'Lee Edward Unkrich (born August 8, 1967) is an American film director, film editor, screenwriter, and animator.',
            Birthyear: '1967'
        },
        imageUrl: 'https://images.app.goo.gl/Jx5ymfdFqh7rP6U67',
        year: '2017',
        featured: 'yes'
    },
    {
        title: 'Gone Girl', 
        description: 'With his wife\'s disappearance having become the focus of an intense media circus, a man sees the spotlight turned on him when it\'s suspected that he may not be innocent.',
        genre: {
            name: 'thriller',
            description: 'Thriller is a genre of fiction with numerous, often overlapping, subgenres, including crime, horror and detective fiction.'
        },
        director: 
        {
            name: 'David Fincher',
            bio: 'David Andrew Leo Fincher is an American film director. His films, mostly psychological thrillers, have received 40 nominations at the Academy Awards, including three for him as Best Director.',
            Birthyear: '1962'
        },
        imageUrl: 'https://images.app.goo.gl/MdL5YuL9EF1sfh7B9',
        year: '2014',
        featured: 'yes'
    },
    {
        title: 'Gone with the Wind', 
        description: 'Gone with the Wind is a 1939 American epic historical romance film adapted from the 1936 novel by Margaret Mitchell.',
        genre: {
            name: 'romance',
            description: 'Romance films, romance movies, or ship films involve romantic love stories recorded in visual media for broadcast in theatres or on television that focus on passion, emotion, and the affectionate romantic involvement of the main characters.'
        },
        director: 
        { 
            name: 'Victor Fleming',
            bio: 'Victor Lonzo Fleming was an American film director, cinematographer, and producer.',
            Birthyear: '1889'
        },
        imageUrl: 'https://images.app.goo.gl/MdL5YuL9EF1sfh7B9',
        year:'1939',
        featured: 'yes'
    },
    {
        title: 'Star Wars', 
        description: 'Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire\'s world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader.',
        genre: {
            name: 'science fiction',
            description: 'Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, dinosaurs, interstellar travel, time travel, or other technologies.'
        },
        director: 
        {
            name: 'George Lucas',
            bio: 'George Walton Lucas Jr. is an American filmmaker. Lucas is best known for creating the Star Wars and Indiana Jones franchises and founding Lucasfilm, LucasArts, Industrial Light & Magic and THX.',
            Birthyear: '1944'
        },
        imageUrl: 'https://images.app.goo.gl/npzmKEErmkW571eM7',
        year: '1977',
        featured: 'yes'
    },
    {
        title: 'Avatar: The Way of Water', 
        description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
        genre: {
            name: 'action',
            description: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
        },
        director: 
        {
            name: 'James Cameron', 
            bio: 'James Francis Cameron is a Canadian filmmaker, who is a major figure in the post-New Hollywood era, he is considered one of the industry\'s most innovative filmmakers, regularly pushing the boundaries of cinematic capability with his use of novel technologies.',
            Birthyear: '1954'
        },
        imageUrl: 'https://images.app.goo.gl/vLw2cKVqEzEZYDto7',
        year: '2022',
        featured: 'yes'
    },
];

let users = [
    {
        id: '1',
        username: 'Saule',
        password: 'saule123',
        email: 'saule@email.com',
        birthday: '1991-10-10',
        favoriteMovies: ["Avatar","Pirates of the Caribbean"]
    },
    {
        id: '2',
        username: 'Bakhtiyar',
        password: 'bakhtiyar123',
        email: 'bakhtiyar@email.com',
        birthday: '1992-10-10',
        favoriteMovies: ["Avatar"]
    },
    {
        id: '3',
        username: 'Juan',
        password: 'juan123',
        email: 'juan@email.com',
        birthday: '1993-10-10',
        favoriteMovies: ["Inception"]
    },
    {
        id:'4',
        username: 'Katherine',
        password: 'katherine123',
        email: 'katherine@email.com',
        birthday: '1994-10-10',
        favoriteMovies: ["Coco"]
    },
    {
        id: '5',
        username: 'Janet',
        password: 'janet123',
        email: 'janet@email.com',
        birthday: '1998-10-10',
        favoriteMovies: ["Star Wars"]
    }
]

app.get('/', (req, res)=>{
    res.send('Welcome to my Movie Club!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

//returns a list of ALL movies using GET
app.get('/movies', passport.authenticate('jwt', {session: false}), (req, res)=> {
    Movies.find()
        .then((movies)=>{
            res.status(201).json(movies);
        })
        .catch((error)=>{
            console.error(error);
            res.status(500).send("Error: "+error);
        });
});

//returns movie search by title
app.get('/movies/:title',  passport.authenticate('jwt', {session: false}), (req, res)=> {
    Movies.findOne({title: req.params.title})
        .then((movie)=>{
            res.json(movie);
        })
        .catch((err)=>{
            console.error(err);
            res.status(500).send("Error: "+err);
        });
});

//genre search 
app.get('/movies/genre/:genreName',  passport.authenticate('jwt', {session: false}), (req, res) => {
   Movies.findOne({
     'genre.name': req.params.genreName
   })
   .then((movie)=>{
    res.json(movie.genre);
   })
   .catch((err)=>{
    console.error(err);
    res.status(500).send('Error: ' + err);
   });
});

//director data
app.get('/movies/director/:directorName',  passport.authenticate('jwt', {session: false}), (req,res)=>{
    Movies.findOne({ 
        'director.name': req.params.directorName 
    })
    .then((movie) => {
      res.json(movie.director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//register new user using POST
app.post('/users',  

//validation logic
[
    check('Uername', 'username is required').isLength({min: 5}),
    check('Username','username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
],
//authentication
passport.authenticate('jwt', {session: false}),
(req,res)=>{

// check the validation object for errors
let errors = validationResult(req);

if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);

    Users.findOne({username: req.body.username})
        .then((user)=>{
            if(user){
                return res.status(400).send(req.body.username+' already exists');
            }else{
            Users.create({
                username: req.body.username,
                password: hashedPassword, //or hashedpassword? and if yes, change let hashedPassword to lowercase
                email: req.body.email,
                birthday: req.body.birthday
            })
            .then((user)=>{res.status(201).json(user)})
            .catch((error)=>{
                console.error(error);
                res.status(500).send("Error: "+error);
            })
        }
    })
    .catch((error)=>{
        console.error(error);
        res.status(500).send("Error: "+error);
    });
});

//to update user info
app.patch('/users/:username', 
[
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], 
   passport.authenticate('jwt', {session: false}), (req, res)=>{

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
        }
    
        let hashedPassword = Users.hashPassword(req.body.Password);

    Users.findOneAndUpdate(
        {username: req.params.username},
        { $set: {
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            birthday: req.body.birthday
            }
        },
        { new: true },(err, updatedUser) => {
            if(err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
    });
});


//add movies to favorites using POST 
app.post('/users/:username/movies/:movieID',  passport.authenticate('jwt', {session: false}), (req,res)=>{
    Users.findOneAndUpdate({username: req.params.username},
    {
        $push: {favoriteMovies: req.params.movieID}
    },
    {new: true}, (err, updatedUser)=>{
        if(err){
            console.error(err);
            res.status(500).send('Error: '+err);
        }else{
            res.json(updatedUser);
        }
     });
    });

//remove movies from favourites using DELETE 
app.delete('/users/:username/movies/:movieID', 
passport.authenticate('jwt', {session: false}), (req,res)=>{
    Users.findOneAndUpdate({ username: req.params.username}, {
        $pull: { favoriteMovies: req.params.movieID }
      },
      { new: true }, (err, updatedUser) => {
       if (err) {
         console.error(err);
         res.status(500).send('Error: ' + err);
       } else {
         res.json(updatedUser);
         res.status(200).send('successfully deleted from favorites');
       }
    });
  });

// Deletes user account using DELETE method
  app.delete('/users/:username',  passport.authenticate('jwt', {session: false}), (req,res)=>{
    Users.findOneAndRemove({ username: req.params.username}).then((user)=>{
        if(!user){
            res.status(400).send(req.params.username + ' was not found');
        }else{
            res.status(200).send(req.params.username + ' was deleted.');
        }
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send('Error: '+err);
    });
  });

  //get all users
  app.get('/users',  passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  //gets info about a single user
  app.get('/users/:username',  passport.authenticate('jwt', {session: false}), (req, res)=> {
    Users.findOne({username: req.params.username})
        .then((user)=>{
            res.json(user);
        })
        .catch((err)=>{
            console.error(err);
            res.status(500).send("Error: "+err);
        });
});

// app.listen(8080, ()=>{
//     console.log('Your app is listening on port 8080.');
// });

//replaced app.listen with this:
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});

app.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500).send('You have an error!');
});