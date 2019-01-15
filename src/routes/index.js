const { Router } = require('express');

const path = require('path');
const { unlink } = require('fs-extra');

const router = Router();

// Models
const Image = require('../models/Image');

//getting every image for index
router.get('/', async (req, res) => {
    const images = await Image.find();
    res.render('index', { images });
});

//getting view to upload an image
router.get('/upload', (req, res) => {
    res.render('upload');
});

//uploading an image
router.post('/upload', async (req, res) => {
  /*   console.log(req.file);
    console.log(Date.now());
    res.send(' uploaded'); */
    const image = new Image();
    image.title = req.body.title;
    image.description = req.body.description;
    image.filename = req.file.filename;
    image.path = '/img/uploads/' + req.file.filename;
    image.originalname = req.file.originalname;
    image.mimetype = req.file.mimetype;
    image.size = req.file.size;

    await image.save();
    res.redirect('/');
});

//getting an img by id to view in profile
router.get('/image/:id', async (req, res) => {
    const { id } = req.params;
    const image = await Image.findById(id);
    //console.log(image);
    res.render('profile', { image });
});


//deleting an image by id
router.get('/image/:id/delete', async (req, res) => {
    const { id } = req.params;
    const imageDeleted = await Image.findByIdAndDelete(id);
    await unlink(path.resolve('./src/public' + imageDeleted.path));
    res.redirect('/');
    //res.send(' img deleted');
});

module.exports = router;
