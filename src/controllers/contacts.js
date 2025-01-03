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
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar as env } from '../utils/getEnvVar.js';

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
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createHttpError(400, 'Invalid contact ID format');
  }

  const contact = await getContactById(contactId, userId);

  if (contact.userId.toString() !== userId.toString()) {
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
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const contact = await createContact(userId, {
    ...req.body,
    photo: photoUrl,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const updatedContact = await updateContact(contactId, userId, {
    ...req.body,
    photo: photoUrl,
  });

  if (!updatedContact) {
    return next(createHttpError(404, 'Contact not found'));
  }

  if (updatedContact.userId.toString() !== userId.toString()) {
    return next(createHttpError(403, 'Access to the contact is denied'));
  }

  console.log('Successfully updated contact:', updatedContact);

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

export const deleteContactsController = async (req, res, next) => {
  const userId = req.user._id;
  const { contactId } = req.params;

  const contact = await deleteContact(contactId, userId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
  }

  if (contact.userId.toString() !== req.user._id.toString()) {
    throw createHttpError(403, 'Access to the contact is denied');
  }

  res.status(204).send();
};
