import express from 'express';
import {
  createContactController,
  getContactByIdController,
  getContactsController,
  removeContactController,
  updateContactByIdController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createValidationContactsSchema,
  updateValidationContactsSchema,
} from '../db/models/contact.js';

const router = express.Router();

router.use('/contacts/:contactId', isValidId('contactId'));

router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

router.post(
  '/contacts',
  validateBody(createValidationContactsSchema),
  ctrlWrapper(createContactController),
);

router.delete('/contacts/:contactId', ctrlWrapper(removeContactController));

router.patch(
  '/contacts/:contactId',
  validateBody(updateValidationContactsSchema),
  ctrlWrapper(updateContactByIdController),
);

export default router;
