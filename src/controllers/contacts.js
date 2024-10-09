import createHttpError from 'http-errors';
import {
  createNewContact,
  getAllContacts,
  getContactById,
  removeContact,
  updateContactById,
} from '../services/contacts.js';

export const getContactsController = async (req, res) => {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      return next(createHttpError(404, 'Contact not found'));
    }
    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContactController = async (req, res) => {
  const contact = await createNewContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const removeContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await removeContact(contactId);
  res.status(204).send();
  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }
};

export const updateContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const { body } = req;
  const contact = await updateContactById(contactId, body);
  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }
  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};
