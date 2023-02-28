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
            Birthyear: '1961',
            Deathyear: 'present'
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
            Birthyear: '1970',
            Deathyear: 'present'
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
            Birthyear: '1941',
            Deathyear: 'present'
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
            Birthyear: '1970',
            Deathyear: 'present'
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
            Birthyear: '1964',
            Deathyear: 'present'
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
            Birthyear: '1967',
            Deathyear: 'present'
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
            Birthyear: '1962',
            Deathyear: 'present'
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
            Birthyear: '1889',
            Deathyear: '1949'
        },
        imageUrl: 'https://images.app.goo.gl/MdL5YuL9EF1sfh7B9',
        year:'1939',
        featured: 'yes'
    },
    {
        title: 'Star Wars', 
        description: '',
        genre: {
            name: 'science fiction',
            description: 'Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, dinosaurs, interstellar travel, time travel, or other technologies.'
        },
        director: 
        {
            name: 'George Lucas',
            bio: 'George Walton Lucas Jr. is an American filmmaker. Lucas is best known for creating the Star Wars and Indiana Jones franchises and founding Lucasfilm, LucasArts, Industrial Light & Magic and THX.',
            Birthyear: '1944',
            Deathyear: 'present'
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
            Birthyear: '1954',
            Deathyear: 'present'
        },
        imageUrl: 'https://images.app.goo.gl/vLw2cKVqEzEZYDto7',
        year: '2022',
        featured: 'yes'
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