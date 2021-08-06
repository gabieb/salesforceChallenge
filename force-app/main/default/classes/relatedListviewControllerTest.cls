/**
 * @description       : Test class for relatedListviewController
 * @author            : Gabriela
 * @group             : 
 * @last modified on  : 08-05-2021
 * @last modified by  : Gabriela
**/
@IsTest
public with sharing class relatedListviewControllerTest {
    
    @testSetup 
    static void setup() {

        List<B__c> bList = new List<B__c>();
        List<C__c> cList = new List<C__c>();
        Integer registerCount = 100;

        A__c a = new A__c(Name = 'A1');
        insert A;
        
        for(Integer i=0; i<registerCount; i++){
            B__c b = new B__c(Name='B'+i, A__c = a.Id);
            bList.add(b);
        }
        insert bList;
        
        for(B__c b : bList){
            C__c c = new C__c(Name = 'C - '+ b.Name, B__c = b.Id);
            cList.add(c);
        }
		insert cList;
    }

    @isTest
    static void testRelatedListComponent(){

        A__c a = [SELECT Id FROM A__c WHERE Name = 'A1'];
        
        List<SObject> sObjectList = relatedListviewController.getRecordsList(a.Id);
        
        System.assertEquals(200, sObjectList.size());
    }
}