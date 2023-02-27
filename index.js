const express = require('express'),
      morgan = require('morgan'),
      fs = require('fs'),
      path = require('path'),
      bodyParser=require('body-parser'),
      uuid=require('uuid');

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"),{flags: 'a'})

app.use(morgan('common', {stream: accessLogStream}));
app.use(express.static('public'));
app.use(bodyParser.json());

let topTenMovies = [
    {
        title: 'The Lord of the Rings', 
        genre: 'fantasy',
        director: 'Peter Jackson',
        imageUrl: 'https://pixabay.com/images/id-2021410/',
        year: '2003'
    },
    {
        title: 'Inception', 
        genre: 'science fiction',
        director: 'Christopher Nolan',
        imageUrl: 'https://pixabay.com/images/id-3265473/',
        year: '2010'
    },
    {
        title: 'Spirited Away', 
        genre: 'anime',
        director: 'Hayao Miyazaki',
        imageUrl: 'https://pixabay.com/images/id-1754734/',
        year: '2001'
    },
    {
        title: 'The Prestige', 
        genre: 'thriller',
        director: 'Christopher Nolan',
        imageUrl: 'https://pixabay.com/images/id-233171/',
        year: '2006'
    },
    {
        title: 'The Intouchables',
        genre: 'comedy',
        director: 'Olivier Nakache and Eric Toledano',
        imageUrl: 'https://images.app.goo.gl/fAvU5S5531iEXH418',
        year: '2011'
    },
    {
        title: 'Coco', 
        genre: 'musical',
        director: 'Adrian Molina and Lee Unkrich',
        imageUrl: 'https://images.app.goo.gl/Jx5ymfdFqh7rP6U67',
        year: '2017'
    },
    {
        title: 'Gone Girl', 
        genre: 'thriller',
        director: 'David Fincher',
        imageUrl: 'https://images.app.goo.gl/MdL5YuL9EF1sfh7B9',
        year: '2014'
    },
    {
        title: 'Gone with the Wind', 
        genre: 'romance',
        director: 'Victor Fleming',
        imageUrl: 'https://images.app.goo.gl/MdL5YuL9EF1sfh7B9',
        year:'1939'
    },
    {
        title: 'Star Wars', 
        genre: 'science fiction',
        director: 'George Lucas',
        imageUrl: 'https://images.app.goo.gl/npzmKEErmkW571eM7',
        year: '1977'
    },
    {
        title: 'Avatar', 
        genre: 'action',
        director: 'James Cameron', 
        imageUrl: 'https://images.app.goo.gl/vLw2cKVqEzEZYDto7',
        year: '2022'
    },
];

let users = [
    {
        id: '1',
        name: 'Saule',
        favoriteMovieList: []
    },
    {
        id: '2',
        name: 'Bakhtiyar',
        favoriteMovieList: ["Inception", "Coco"]
    },
    {
        id: '3',
        name: 'Juan',
        favoriteMovieList: []
    }
]
app.get('/', (req, res)=>{
    res.send('Welcome to my Movie Club!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

//returns a list of ALL movies using GET
app.get('/movies', (req, res)=> {
    res.json(topTenMovies);
});

//returns movie search by title
app.get('/movies/:title', (req, res)=> {
    const {title}=req.params;
    const movie=topTenMovies.find(movie=>movie.title === title);
    if(movie){
        res.status(201).json(movie);
    }else{
        res.status(400).send('no movie found');
    }
});

//genre search 
app.get('/movies/genre/:genreName', (req, res) => {
    const {genreName}=req.params;
    const genre=topTenMovies.find(movie=>movie.genre === genreName).genre; 
    if(genre){
        res.status(201).json(genre);
    }else{
        res.status(400).send('no genre found');
    }
});

//director data
app.get('/movies/director/:directorName',(req,res)=>{
    const{directorName} =req.params;
    const director =topTenMovies.find(movie=> movie.director===directorName).director;
    if (director){
        res.status(201).json(director);
    }else{
        res.status(400).send('no director found');
    }
});

//register new user using POST
app.post('/users',(req,res)=>{
    let newUser=req.body;

    if(!newUser.name){
        const message='Missing name in request body';
        res.status(400).send(message);
    }else{
        newUser.id=uuid.v4();
        users.push(newUser);
        res.status(201).send(newUser);
    }
});

//if user wants to update user info like username; using PUT
app.put('/users/:id', (req, res)=>{
    const {id}=req.params;
    const userUpdate=req.body;

    let user=users.find(user=>user.id === id);

    if(user){
        user.name=userUpdate.name;
        res.status(201).json(user);
    }else{
        res.status(400).send('cannot update');
    }
});

//add movies to favorites using POST
app.post('/users/:id/:favoriteMovieTitle', (req,res)=>{
    const{id, favoriteMovieTitle}=req.params;

    let user=users.find(user=>user.id ==id);

    if(user){
        user.favoriteMovieList.push(favoriteMovieTitle);
        res.status(201).send('movie added to your favorites list');
        console.log(favoriteMovieTitle);
    }else{
        res.status(400).send('movie not added');
    }
});

//remove movies from favourites using DELETE
app.delete('/users/:id/:favoriteMovieTitle', (req,res)=>{
    const {id, favoriteMovieTitle} =req.params;
    let user = users.find(user=>user.id ==id);
    if(user){ user.favoriteMovieList=user.favoriteMovieList.filter(title=>title !== favoriteMovieTitle);
        res.status(201).send('movie was deleted from your favorites');
    }else{
        res.status(400).send('movie was not deleted');
    }
});

// Deletes user account using DELETE method
app.delete('/users/:id', (req, res) => {
    const {id} = req.params;
    let user = users.find(user => user.id === id );

    if (user) {
      users = users.filter(user => user.id !== req.params.id);
      res.status(201).send('User account ' + req.params.id + ' was deleted.');
    }
  });

app.listen(8080, ()=>{
    console.log('Your app is listening on port 8080.');
});

app.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500).send('You have an error!');
});