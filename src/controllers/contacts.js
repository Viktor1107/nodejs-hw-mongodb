import mongoose from 'mongoose';
import {
  deleteContact,
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res, next) => {
  const userId = req.user._id;

  const { page, perPage } = parsePaginationParams(req.query);

  const { sortBy, sortOrder } = parseSortParams(req.query);

  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    userId,
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createHttpError(400, 'Invalid contact ID format');
  }

  const contact = await getContactById(contactId, userId);

  if (contact.userId.toString() !== req.user.id) {
    throw createHttpError(403, 'Access to the contact is denied');
  }

  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully found contact with id ${contactId}!',
    data: contact,
  });
};

export const createContactsController = async (req, res) => {
  const userId = req.user._id;
  const contact = await createContact(req.body, userId);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const result = await updateContact(contactId, userId, {
    ...req.body,
  });

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  if (result.userId.toString() !== userId.toString()) {
    throw createHttpError(403, 'Access to the contact is denied');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};

export const deleteContactsController = async (req, res, next) => {
  const userId = req.user._id;
  const { contactId } = req.params;

  const contact = await deleteContact(contactId, userId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
  }

  if (contact.userId.toString() !== req.user.id) {
    throw createHttpError(403, 'Access to the contact is denied');
  }

  res.status(204).send();
};
