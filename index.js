const express = require('express'),
      morgan = require('morgan'),
      fs = require('fs'),
      path = require('path');

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"),{flags: 'a'})

app.use(morgan('common', {stream: accessLogStream}));
app.use(express.static('public'));

let topTenMovies = [
    {
        title: 'The Lord of the Rings', 
        year: '2003'
    },
    {
        title: 'Inception', 
        year: '2010'
    },
    {
        title: 'Spirited Away', 
        year: '2001'
    },
    {
        title: 'The Prestige', 
        year: '2006'
    },
    {
        title: 'The Intouchables',
        year: '2011'
    },
    {
        title: 'Coco', 
        year: '2017'
    },
    {
        title: 'Gone Girl', 
        year: '2014'
    },
    {
        title: 'Gone with the Wind', 
        year:'1939'
    },
    {
        title: 'Star Wars', 
        year: '1977'
    },
    {
        title: 'Avatar', 
        year: '2022'
    },
];

app.get('/', (req, res)=>{
    res.send('This is about to be a Movie Club!');
});

app.get('/movies', (req,res)=> {
    res.json(topTenMovies);
});

app.listen(8080, ()=>{
    console.log('Your app is listening on port 8080.');
});

app.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500).send('You have an error!');
});