const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://taskapp:@Lucknow160@cluster0-jfyyd.mongodb.net/mean-project?w=majority', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
});
