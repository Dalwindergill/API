const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const Bootcamp = require('./models/Bootcamp');
dotenv.config({ path: './config/config.env' });
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Read the json file
const bootcamps = JSON.parse(
  fs.readFileSync(
    `./_data/bootcamps.json`,
    'utf-8'
  )
);

const importData = async () => {
    try {
        console.log('hello')
        await Bootcamp.create(bootcamps);
        console.log('world')
    console.log('data imported');
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log('data deleted');
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '-i') {
    importData().then(() => {
      process.exit();
  });
  
} else if (process.argv[2] === '-d') {
  deleteData().then(() => {
        process.exit();
      });
}
