var ObjectID = require('mongodb').ObjectID;
const multer = require('multer');



let nameImg = ''




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        console.log(file)
        nameImg = file.originalname
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
    app.get('/seminars', (req,res)=>{
        someDB.collection('seminars').find({}).toArray((err,items)=>{
            if(err){
                res.send({'error':'An error has occurred'});
            } else {
                res.send(items)
            }
        });
    });
    app.get('/seminars/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        someDB.collection('seminars').findOne(details, (err, item) => {
          if (err) {
            res.send({'error':'An error has occurred'});
          } else {
            res.send(item);
          } 
        });
    });
  
    app.post('/seminarsadd',upload.fields([{ name: 'image', maxCount: 1 }, { name: 'description', maxCount: 10 }]), (req,res)=>{
        console.log(nameImg);
        const obj = JSON.parse(req.body.description)
        console.log(obj)
        const id = obj.id
        const details = { '_id': new ObjectID(id) };
        let date = new Date(obj.dateSeminar)

        const seminar = {
            allArticles: obj.allArticles,
            allParagraph: obj.allParagraph,
            authors: obj.authors,
            countPlace: obj.countPlace,
            dateDay: date.getDate(),
            dateMounth: date.getMonth()+1,
            dateYear: date.getFullYear(),
            dateSeminar: obj.dateSeminar,
            format: obj.format,
            img: nameImg,
            name: obj.name,
            valuesTable: obj.valuesTable,
        }
        if(id){
            someDB.collection('seminars').update(details, seminar, (err, result) => {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    res.send(seminar);
                } 
            });
        } else {
            someDB.collection('seminars').insert(seminar, (err,result) =>{
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    res.status(200).send(result)
                }
            })  
        }
    })
    app.delete('/seminars/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        someDB.collection('seminars').removeOne(details, (err, item) => {
          if (err) {
            res.send({'error':'An error has occurred'});
          } else {
            res.send('seminars ' + id + ' deleted!');
          } 
        });
      });
    app.put('/seminars/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    const seminar = { allArticles: req.body.allArticles };
    someDB.collection('seminars').update(details, seminar, (err, result) => {
        if (err) {
            res.send({'error':'An error has occurred'});
        } else {
            res.send(seminar);
        } 
    });
    });
}