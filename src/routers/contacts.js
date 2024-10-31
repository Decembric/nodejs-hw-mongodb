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

router.use('/:contactId', isValidId('contactId'));

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', ctrlWrapper(getContactByIdController));

router.post(
  '/',
  validateBody(createValidationContactsSchema),
  ctrlWrapper(createContactController),
);

router.delete('/:contactId', ctrlWrapper(removeContactController));

router.patch(
  '/:contactId',
  validateBody(updateValidationContactsSchema),
  ctrlWrapper(updateContactByIdController),
);

export default router;
