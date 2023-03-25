const mongoose=require('mongoose');

const bcrypt = require('bcrypt');

const MovieSchema = new mongoose.Schema({
  id: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    genre: {
      name: String,
      description: String
    },
    director: {
      name: String,
      bio: String
    },
    actors: [String],
    imagePath: String,
    featured: Boolean
  });
  
  const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    birthday: Date,
    favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
  });

  UserSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
  };
  
  UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
  };
  
  const Movie = mongoose.model('Movie', MovieSchema);
  const User = mongoose.model('User', UserSchema);
  
  module.exports.Movie = Movie;
  module.exports.User = User;