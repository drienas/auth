const { verifyToken } = require('./jwt');
const { getSingleUserByName } = require('./User');

const accessMatrix = require('./accessMatrix.json');

const authMiddleWare = async (req, res, next) => {
  try {
    let path = req.route.path;
    path = path.replace(/\//gi, '');
    let methods = req.route.methods;
    let method = Object.keys(methods).filter((x) => !!methods[x]);
    method = method[0];
    let accessGroups = accessMatrix.find(
      (x) => new RegExp(x.ep, 'gi').test(path) && x.method === method
    );

    accessGroups =
      typeof accessGroups === 'object' && accessGroups.requiredGroups
        ? accessGroups.requiredGroups
        : [];

    if (!req.headers.authorization) {
      res.status(401).send('Unauthorized');
      return;
    }
    const token = req.headers.authorization.split(' ')[1];
    const { valid, data } = verifyToken(token);
    if (!data.username) valid = false;
    else {
      let dbdata = await getSingleUserByName(data.username);
      if (!dbdata) valid = false;
      else {
        let groups = dbdata.groups;
        let hasAccessGroup = groups.filter((x) => accessGroups.includes(x));
        if (hasAccessGroup.length === 0) valid = false;
      }
    }
    if (valid) {
      console.log(`${data.username} accessing ${path}`);
      next();
    }
  } catch (error) {
    console.error(new Error(error));
    res.status(401).send('Unauthorized');
  }
};

module.exports = authMiddleWare;
