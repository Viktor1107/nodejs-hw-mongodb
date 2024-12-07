import mongoose from 'mongoose';
import { deleteContact, getAllContacts, getContactById, createContact, updateContact} from "../services/contacts.js"
import createHttpError from 'http-errors';



export const getContactsController = async (req, res, next) =>{
	const contacts = await getAllContacts()

	res.status(200).json({
		status: 200,
		message: "Successfully found contacts!",
		data: contacts
	  });
	
};

export const getContactByIdController = async(req, res, next) =>{
	const{contactId} = req.params;

	if (!mongoose.Types.ObjectId.isValid(contactId)) {
		throw createHttpError(400, 'Invalid contact ID format');
	  }

	const contact = await getContactById(contactId)
	

	if (!contact) {
		return next(createHttpError(404, 'Contact not found'));
	  }
	res.status(200).json({
		status: 200,
		message: "Successfully found contact with id ${contactId}!",
		data: contact
	})

};

export const createContactsController = async (req, res) => {
	const contact = await createContact(req.body)

	res.status(201).json({
		status: 201,
		message: "Successfully created a contact!",
		data: contact
	})

  };

  export const patchContactController = async(req, res, next) => {
	const {contactId} = await req.params;
	const result = await updateContact(contactId, req.body);

	if(!result) {
		next(createHttpError(404, 'Contact not found'));
		return
	}

	res.json({
		status: 200,
	message: "Successfully patched a contact!",
	data:result.contact,
	});

  };

  export const deleteContactsController = async (req, res, next) => {
	const {contactId} = req.params;

	const contact = await deleteContact(contactId)

	if(!contact){
		next(createHttpError(404, 'Contact not found'))
	}

	res.status(204).send()
  }
