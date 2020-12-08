var ObjectID = require('mongodb').ObjectID;
const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = function(app, db){
    const someDB = db.db('sn');
    app.get('/news', (req,res)=>{
        someDB.collection('news').find({}).toArray((err,items)=>{
            if(err){
                res.send({'error':'An error has occurred'});
            } else {
                res.send(items)
            }
        });
    });
    app.get('/news/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        someDB.collection('news').findOne(details, (err, item) => {
          if (err) {
            res.send({'error':'An error has occurred'});
          } else {
            res.send(item);
          } 
        });
    });
    app.post('/newsadd',upload.fields([{ name: 'imageAuthor', maxCount: 1 },{ name: 'imageLittle', maxCount: 1 },{ name: 'imageBig', maxCount: 1 }, { name: 'description', maxCount: 10 }]), (req,res)=>{
        const obj = JSON.parse(req.body.description)
        const id = obj.id
        const details = { '_id': new ObjectID(id) };
        let date = new Date()
        const news = {
            dateDay: date.getDate(),
            dateYear: date.getFullYear(),
            dateMonth: date.getMonth()+1,
            dateSeconds: date.getSeconds(),
            dateMinutes: date.getMinutes(),
            dateHours: date.getHours(),
            authorsImages: obj.authorsImages,
            littleImages: obj.littleImages,
            bigImages: obj.bigImages,
            title: obj.title,
            littleDescription: obj.littleDescription,
            authors: obj.authors,
            specialization: obj.specialization,
            allArticles: obj.allArticles,
            allParagraph: obj.allParagraph,
        }
        console.log(news)
        if(id){
            someDB.collection('news').update(details, news, (err, result) => {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    res.send(news);
                } 
            });
        } else {
            someDB.collection('news').insert(news, (err,result) =>{
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    res.status(200).send(result)
                }
            })  
        }
    })
    app.delete('/news/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        someDB.collection('news').removeOne(details, (err, item) => {
          if (err) {
            res.send({'error':'An error has occurred'});
          } else {
            res.send('seminars ' + id + ' deleted!');
          } 
        });
      });
}