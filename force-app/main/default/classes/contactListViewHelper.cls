public with sharing class contactListViewHelper {
        @AuraEnabled(cacheable=True)
        public static list<Contact> getContacts(){
            return [SELECT id, firstName, lastName, accountId, account.name, mailingStreet, mailingCity, mailingState, mailingPostalCode, mailingCountry, email
            FROM Contact
            Limit 1000];
        }

        @AuraEnabled(cacheable=True)
        public static list<Contact>  searchContact(string searchString){
          list<list<SObject>> contacts = [FIND :searchString IN ALL FIELDS RETURNING Contact(FirstName, LastName, Email, mailingStreet,
          mailingCity, mailingCountry,  mailingPostalCode, account.Name)];

          return (list<Contact>) contacts[0];
        }

        @AuraEnabled
        public static void deleteContacts(list<Id> contactIds){
           if(contactIds.size() > 0) {
               delete [SELECT id FROM contact WHERE Id in: contactIds];
           }
        }
}
