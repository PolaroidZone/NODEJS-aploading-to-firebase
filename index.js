const express = require('express')
const multer = require('multer')
const firebase = require('firebase/app')
const firebaseConfig = require('./config.js')
const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage")

firebase.initializeApp(firebaseConfig)

const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const storage = getStorage()
const upload = multer({ storage: multer.memoryStorage()})

app.get('/', (req, res) => {
    res.send(`
      <div>
        <form action="/upload" method="post" enctype="multipart/form-data">
          <input type="file" name="file" required> <!-- Add the "name" attribute to the input field -->
          <button type="submit">Submit</button>
        </form>
      </div>
    `)
  })

app.post('/upload', upload.single('file'), async(req, res) => {
    const imageRef = 'images/'+ req.file.originalname
    
    const storageRef = ref(storage, imageRef);

    await uploadBytes(storageRef, req.file.buffer)
    .then((snapshot) => {
        console.log('file uploaded')
        getDownloadURL(snapshot.ref)
        .then((url) => {
            console.log(url)
        })
    })

})


app.listen(port, () => console.log(`Example app listening on http://localhost:${port}`))