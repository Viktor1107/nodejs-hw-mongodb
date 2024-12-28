import { SORT_ORDER } from "../constants/index.js";
import { ContactsCollection } from "../db/models/contacts.js"
import { calculatePaginationData } from "../utils/calculatePaginationData.js";


export const getAllContacts = async({page = 1, perPage = 10, sortOrder = SORT_ORDER.ASC,
	sortBy = '_id', filter = {} }) => {
	const limit = perPage;
	const skip = (page - 1) * perPage;


	const contactsQuery = ContactsCollection.find(filter);

	if (filter.type) {
		contactsQuery.where('contactType').equals(filter.type);
	  }
	
	  if (filter.hasOwnProperty('isFavourite')) {
		contactsQuery.where('isFavourite').equals(filter.isFavourite);
	  }


	  const [contactsCount, contacts] = await Promise.all([
		ContactsCollection.find(filter).countDocuments(),
		contactsQuery
		.skip(skip)
		.limit(limit)
		.sort({ [sortBy]: sortOrder })
		.exec(),
	  ]);


  const paginationData = calculatePaginationData(contactsCount, perPage, page);

	return {
		data:contacts, ...paginationData,
	};
}; 


export const getContactById = async (contactId, userId) => {
	console.log('Fetching contact with ID:', contactId);
	const contact = await ContactsCollection.findById(contactId, userId);
	return contact;
} 

export const createContact = async(payload, userId) => {
	const contact = await ContactsCollection.create(payload, userId);
	return contact;
}

export const updateContact = async(contactId, payload, userId, options = {}) => {
	const rawResult = await ContactsCollection.findOneAndUpdate(
		{_id:contactId, userId},
		payload,
		{
			new:true,
			includeResultMetadata: true,
			...options,
		},
	);
	if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};


export const deleteContact = async (contactId, userId) => {
	const contact = await ContactsCollection.findOneAndDelete({
		_id:contactId, userId,
	})

	return contact
}
