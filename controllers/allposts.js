const Allposts = require('../models/allposts');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded',
      });
    }

    let allposts = new Allposts(fields);

    if (files.photo) {
      allposts.photo.data = fs.readFileSync(files.photo.path);
      allposts.photo.contentType = files.photo.type;
    }

    allposts.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};

exports.allpostsById = (req, res, next, id) => {
  Allposts.findById(id).exec((err, allposts) => {
    if (err || !allposts) {
      return res.status(400).json({
        error: 'allposts not found',
      });
    }
    req.allposts = allposts;
    next();
  });
};

exports.read = (req, res) => {
  req.allposts.photo = undefined;
  return res.json(req.allposts);
};

exports.photo = (req, res, next) => {
  if (req.allposts.photo.data) {
    res.set('Content-Type', req.allposts.photo.contentType);
    return res.send(req.allposts.photo.data);
  }
  next();
};

exports.remove = (req, res) => {
  let allposts = req.allposts;
  allposts.remove((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: 'post is deleted',
    });
  });
};

exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded',
      });
    }

    let allposts = req.allposts;
    allposts = _.extend(allposts, fields);

    if (files.photo) {
      allposts.photo.data = fs.readFileSync(files.photo.path);
      allposts.photo.contentType = files.photo.type;
    }

    allposts.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};

exports.list = async (req, res) => {
  let order = req.query.order ? req.query.order : "desc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";
  // let page = req.body.limit;

  await Allposts.find()
    .select('-photo')
    .sort([[sortBy, order]])
    // .limit(page)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
};

exports.allpostsCount = async (req, res) => {
  let total = await Allposts.find({}).estimatedDocumentCount().exec();
  res.json(total);
};


const handleQuery = async (req, res, query) => {
  const { inventory, author, genre, provenance, material, acquisition, bookform, fragment, dataGt, dataLt, dimension, cartonnage } = query;

  if (dataGt || dataLt !== 0) {
    const allposts = await Allposts.find({
      $or: [
        { $and: [{ inventory: { $eq: inventory, $exists: true, $ne: null } }] },
        { $and: [{ author: { $eq: author, $exists: true, $ne: null } }] },
        { $and: [{ genre: { $eq: genre, $exists: true, $ne: null } }] },
        { $and: [{ provenance: { $eq: provenance, $exists: true, $ne: null } }] },
        { $and: [{ editiondata: { $gte: dataGt, $lte: (dataLt < 1 ? 100000 : dataLt), $exists: true, $ne: null } }] },
        { $and: [{ material: { $eq: material, $exists: true, $ne: null } }] },
        { $and: [{ acquisition: { $eq: acquisition, $exists: true, $ne: null } }] },
        { $and: [{ bookform: { $eq: bookform, $exists: true, $ne: null } }] },
        { $and: [{ fragment: { $eq: fragment, $exists: true, $ne: null } }] },
      ]
    })
      .select('-photo')
      .exec();

    res.json(allposts);
  } else {
    const allposts = await Allposts.find({
      $or: [
        { $and: [{ inventory: { $eq: inventory, $exists: true, $ne: null } }] },
        { $and: [{ author: { $eq: author, $exists: true, $ne: null } }] },
        { $and: [{ genre: { $eq: genre, $exists: true, $ne: null } }] },
        { $and: [{ provenance: { $eq: provenance, $exists: true, $ne: null } }] },
        { $and: [{ material: { $eq: material, $exists: true, $ne: null } }] },
        { $and: [{ acquisition: { $eq: acquisition, $exists: true, $ne: null } }] },
        { $and: [{ bookform: { $eq: bookform, $exists: true, $ne: null } }] },
        { $and: [{ fragment: { $eq: fragment, $exists: true, $ne: null } }] },
      ]
    })
      .select('-photo')
      .exec();

    res.json(allposts);
  }
}

exports.searchFilters = async (req, res) => {
  // console.log(req.body);
  if (req.body) {
    await handleQuery(req, res, req.body);
  }
}