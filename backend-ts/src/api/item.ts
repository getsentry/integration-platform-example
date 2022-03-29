import express from 'express';

import Item from '../models/Item.model';
import Organization from '../models/Organization.model';

const router = express.Router();

router.get('/', async (request, response) => {
  const data = await Item.findAll();
  const organizationSlug = request.query.organization;
  if (organizationSlug) {
    const organization = await Organization.findOne({
      where: {slug: organizationSlug},
    });
    if (organization) {
      const filteredData = data.filter(item => item.organizationId === organization.id);
      return response.send(filteredData);
    }
  }
  return response.send(data);
});

export default router;
