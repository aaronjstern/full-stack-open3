const mongoose = require("mongoose");

if (!(process.argv.length === 3 || process.argv.length === 5)) {
  console.log(
    "please provide password, name and number as arguments: node mongo.js <password> <name> <number>"
  );
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://aaronjstern1:${password}@cluster0.vzgvm.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 5) {
  const entryName = process.argv[3];

  const entryNumber = process.argv[4];

  const person = new Person({
    name: entryName,
    number: entryNumber,
  });

  person.save().then((result) => {
    console.log("person saved");
    mongoose.connection.close();
  });
}

if (process.argv.length === 3) {
  Person.find({}).then((people) => {
    people.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
}
