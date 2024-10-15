import createHttpError from 'http-errors';
import { contactsModel } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const contacts = await contactsModel
    .find()
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();
  const contactsCount = await contactsModel.countDocuments();
  const paginationData = calculatePaginationData(contactsCount, perPage, page);
  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId) => {
  const contact = await contactsModel.findById(contactId);
  return contact;
};

export const createNewContact = async (payload) => {
  const newContact = await contactsModel.create(payload);
  return newContact;
};

export const removeContact = async (id) => {
  const contact = await contactsModel.findByIdAndDelete(id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
};

export const updateContactById = async (id, payload) => {
  const updatedContact = await contactsModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedContact;
};
