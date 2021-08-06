/**
 * @description       : Controller class for the component relatedListview
 * @author            : Gabriela
 * @group             : 
 * @last modified on  : 08-04-2021
 * @last modified by  : Gabriela
**/
public with sharing class relatedListviewController {

    @AuraEnabled(cacheable=true)
    public static List<SObject> getRecordsList(Id aId){
        System.debug('AQUI CONTROLER');
    	List<SObject> recordList = new List<SObject>();
        Set<Id> BSetId = new Set<Id>();

        for(B__c b : [SELECT Id, Name, Owner.Name, CreatedDate FROM B__c WHERE A__c =: aId]){   
            BSetId.add(b.Id);
            recordList.add(b);
        }
		System.debug('B: ' + recordList.size());
        System.debug(BSetId);
        for(C__c c : [SELECT Id, Name, Owner.Name, CreatedDate FROM C__c WHERE B__c IN: BSetId]){
            System.debug('C' + c);
            recordList.add(c);
        }

        return recordList;
    }
}