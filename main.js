const express = require('express')
const app = express()
const port = 3000


// app.use((req,res,next)=>{
//     console.log("Middleware hit");
//     next();
    
// }); // middleware

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/new', (req, res) => {
  res.send('Hello World new!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})