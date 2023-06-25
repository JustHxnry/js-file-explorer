const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const fs = require('fs');

const explorer = require('./explorer/explorer'),
    formatter = require('./explorer/webFormatter');

const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', async (req, res) => {

    var path = 'This PC';
    var fileList = await explorer.listDrives();

    var files = formatter.formatListFiles(fileList, '');

    res.render('explorer', { path, files });
});

app.get('/*', (req, res) => {
    let path = req.path.split('');
    path.shift();
    path = path.join('');
    path = decodeURIComponent(path);

    var splitPath = path.split('/');
    if (String(splitPath[splitPath.length - 1]).includes('.')) {
        var fileName = String(splitPath[splitPath.length - 1]);
        try {
            var buff = fs.readFileSync(path);
            var buffer = Buffer.from(buff);
            return res.end(buffer);
        } catch (err) {
            console.log(`False File ${fileName}, folder behavior continues...`);
        }
    };

    var fileList = explorer.listFiles(path);

    var files = formatter.formatListFiles(fileList, path);

    res.render('explorer', { path, files });
});

app.post('/back', bodyParser.urlencoded({ extended: false }), (req, res) => {
    var path = req.body.url;

    if (path.length == 3) return res.redirect('http://localhost:3000');

    var upPath = require('path').join(path, '..');

    return res.redirect('http://localhost:3000/' + upPath);
});

app.post('/search', bodyParser.urlencoded({ extended: false }), (req, res) => {
    var key = req.body.key;
    var searchEverywhere = req.body.searchEverywhere || 'off';
    var path = req.body.url;

    let data = explorer.searchFile(key, path, searchEverywhere == 'on' ? true : false);

    if (data == null) data = [];

    return res.render('search', { key, data, path, everywhere: searchEverywhere });
});

app.listen(PORT, () => {
    console.log(`Web Instance running at ${PORT}`);
});