import { contactsModel } from '../db/models/contact.js';

export const getAllContacts = async () => {
  const contacts = await contactsModel.find();
  return contacts;
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
  await contactsModel.findByIdAndDelete(id);
};

export const updateContactById = async (id, payload) => {
  const updatedContact = await contactsModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedContact;
};
