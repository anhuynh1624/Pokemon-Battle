public with sharing class pokemonClass {

    @AuraEnabled(Cacheable=true)
    public static List<Pokemon__c> getPokemonList(){
        try {
            return [SELECT Name, Pokemon_Name__c, Type__c, HP__c, Average_Damage__c, Defense__c, Pokemon_Front__c, Pokemon_Back__c
             FROM Pokemon__c WHERE OwnerId =: UserInfo.getUserId() WITH SECURITY_ENFORCED];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(Cacheable=true)
    public static List<Pokemon__c> searchPokemon(String searchTerm){
        searchTerm = searchTerm.trim();
        if(searchTerm ==''){
            return getPokemonList();
        }
        else{
            searchTerm = '%' + searchTerm + '%';
            return [SELECT Name, Pokemon_Name__c, Type__c, HP__c, Average_Damage__c, Defense__c, Pokemon_Front__c, Pokemon_Back__c
             FROM Pokemon__c WHERE Pokemon_Name__c LIKE :searchTerm AND OwnerId =: UserInfo.getUserId() WITH SECURITY_ENFORCED];
        }
    }
}
