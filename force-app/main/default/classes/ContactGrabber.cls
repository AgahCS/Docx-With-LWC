public with sharing class ContactGrabber {
  @AuraEnabled
  public static list<contact> getAllRelatedContacts(Id acctId){
     return [select id, FirstName, LastName from contact where accountId = :acctId];
  }
}
