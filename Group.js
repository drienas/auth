const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    key: { type: String },
  },
  { timestamps: true }
);

const ifExists = (data) => (data ? data : null);

const Group = mongoose.model('Group', groupSchema);

const createGroup = async (data) => {
  console.log(`Create user`);
  dataTmp = {
    key: data.key,
  };

  console.log(dataTmp);

  const query = await new Group(dataTmp).save();
  return query;
};

const getSingleGroup = async (_id) => {
  return await Group.findOne({ _id });
};

const getSingleGroupByKey = async (key) => {
  return await Group.findOne({ key });
};

const getAllGroups = async () => {
  let query = await Group.find({});
  let data = query.map((x) => ({
    key: x.key,
    _id: x._id,
  }));
  return data;
};

module.exports = {
  Group,
  getSingleGroup,
  getSingleGroupByKey,
  getAllGroups,
};
