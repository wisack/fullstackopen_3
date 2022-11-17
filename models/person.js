const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: [true, 'User name required']
  },
  number: {
    type: String,
    validate:
    [
      {
        validator: number => {
          if (number.length<9) {
            return false
          }
        },
        message: 'Minimum length is 8 digits'
      },
      {
        validator: number => {
          return /^\d{2,3}-\d+$/.test(number)
        },
        message: 'not a valid phone number! Use only 2 or 3 numbers before -',
      }
    ],
    required: [true, 'Number is required'],
  } })



personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)