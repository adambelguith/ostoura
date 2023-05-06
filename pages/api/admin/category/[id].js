
import {Category} from '../../../../models/Product';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  await db.connect();
  const category = await Category.findById(req.query.id);
  await db.disconnect();
  res.send(category);
};

export default handler;