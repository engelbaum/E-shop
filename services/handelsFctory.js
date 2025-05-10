const asyncHandler = require("express-async-handler");

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

  exports.getAll = (Model, populateOptions) =>
    asyncHandler(async (req, res) => {
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 5;
      const skip = (page - 1) * limit;
  
      let query = Model.find({}).skip(skip).limit(limit);
  
      if (populateOptions) {
        query = query.populate(populateOptions);
      }
  
      const documents = await query;
  
      res.status(200).json({
        Result: documents.length,
        page,
        data: documents,
      });
    });
  
exports.getOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.findById(req.params.id);
    if (!document) {
      return res
        .status(404)
        .json({ Message: `Document avec ${req.params.id} non trouvé  ` });
    }
    res.status(200).json({ data: document });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return res
        .status(404)
        .json({ Message: `Document avec "${req.params.id}" non trouvé  ` });
    }
    res.status(200).json({ data: document });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return res
        .status(404)
        .json({ Message: `Document avec "${req.params.id}" non trouvé  ` });
    }
    res.status(204).send();
  });
