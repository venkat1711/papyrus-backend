const PageContent = require('../models/pagecontent');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
    const pageContent = new PageContent(req.body);
    pageContent.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json({ data });
    });
};

exports.pagecontentById = (req, res, next, id) => {
    PageContent.findById(id).exec((err, pagecontent) => {
        if (err || !pagecontent) {
            return res.status(400).json({
                error: 'pagecontent not found',
            });
        }
        req.pagecontent = pagecontent;
        next();
    });
};

exports.read = (req, res) => {
    return res.json(req.PageContent);
};

/*exports.remove = (req, res) => {
    let inventory = req.inventory;
    inventory.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json({
            message: 'inventory deleted sucess',
        });
    });
};

exports.update = (req, res) => {
    const inventory = req.inventory;
    inventory.name = req.body.name;

    inventory.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'inventory not exist',
            });
        }
        res.json({ data });
    });
};

exports.list = (req, res) => {
    Inventory.find().sort({ name: 1 }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(data);
    });
};*/
