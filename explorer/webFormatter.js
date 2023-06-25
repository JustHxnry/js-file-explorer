function formatListFiles(data, path) {
    let res = [];

    data.forEach(file => {
        let obj = {};
        obj.name = file;
        obj.href = path != '' ? (path + '/' + file).replace('\\', '/') : file;
        obj.encodedHref = obj.href.replace('#', '%23');

        res.push(obj);
    });

    return res;
};

module.exports = { formatListFiles };