const mongoose = require('mongoose')



if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}


const password = process.argv[2]
const nameFromArg = process.argv[3]
const numberFromArg = process.argv[4]
const url = `mongodb+srv://wisack:${password}@wisack.ctr42tw.mongodb.net/noteApp?retryWrites=true&w=majority`


mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', noteSchema)

if (process.argv.length===3) {
  Person.find({}).then(result => {
    console.log('phonebook')
    result.forEach(note => {
      console.log(note.name, note.number)

    })
    mongoose.connection.close()
    process.exit(1)
  })

}

else if (process.argv.length===5) {
  const note = new Person({
    name: nameFromArg,
    number: numberFromArg
  })

  note.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
  })
}



