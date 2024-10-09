import express from 'express';
import {
  createContactController,
  getContactByIdController,
  getContactsController,
  removeContactController,
  updateContactByIdController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

router.post('/contacts', ctrlWrapper(createContactController));

router.delete('/contacts/:contactId', ctrlWrapper(removeContactController));

router.patch('/contacts/:contactId', ctrlWrapper(updateContactByIdController));

export default router;
