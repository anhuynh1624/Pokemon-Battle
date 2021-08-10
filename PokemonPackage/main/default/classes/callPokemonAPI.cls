public with sharing class callPokemonAPI {
   
    @AuraEnabled
    public static Boolean callPoke(String pokeName){
        
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint('https://pokeapi.co/api/v2/pokemon/' + pokeName);
            request.setMethod('GET');
            HttpResponse response = http.send(request);
    
            if(response.getStatusCode() == 200){
                Pokemon__c myPoke = new Pokemon__c(Pokemon_Name__c=pokeName, Level__c =1, MP__c=100);
                Map<String,Object> respMap = (Map<String,Object>) JSON.deserializeUntyped(response.getBody());
                
                List<Object> abilities = (List<Object>) respMap.get('abilities');
                List<Object> stats = (List<Object>)respMap.get('stats');

                
                
                //GETTING STATS
                List<Integer> myStats = new List<Integer>();
                for(Integer i=0; i<3; i++){
                    //0 = Hp, 1 = ATTACK, 2=DEFENSE
                    Map<String,Object> a = (Map<String,Object>) stats[i];
                    Integer stat = (Integer) a.get('base_stat');
                    myStats.add(stat);
                }
                myPoke.Base_HP__c = myStats[0];
                myPoke.Base_Defense__c = myStats[2];
                
                //INSERT TYPE
                List<Object> types = (List<Object>)respMap.get('types');
                Map<String,Object> mytype = (Map<String,Object>) types[0];
                Map<String,Object> mytype2 = (Map<String,Object>) mytype.get('type');
                myPoke.Type__c = String.valueOf(mytype2.get('name'));

                //INSERT FRONT AND BACK IMAGE
                Map<String,Object> sprites = ( Map<String,Object>) respMap.get('sprites');
                myPoke.Pokemon_Back__c = String.valueOf(sprites.get('back_default'));
                myPoke.Pokemon_Front__c = String.valueOf(sprites.get('front_default'));
                
                insert myPoke;
                
                
                /*Integer randomNumber = Integer.valueof((Math.random() * 10));
                myPoke.*/
                //GETTING ABILITIES
                List<Ability__c> myAbi = new List<Ability__c>();
                
                for(Integer i=0; i<abilities.size(); i++){
                    if(i<2){
                        Map<String,Object> a = (Map<String,Object>) abilities[i];
                        Map<STring,Object> ability = (Map<String,Object>) a.get('ability');
                        String abiName = String.valueOf(ability.get('name'));
                        
                        //randomize the stats for skill and add it to the Ability__c
                        Integer randomNumber = Integer.valueof((Math.random() * 15));
                        Integer abiDmg = myStats[1]-randomNumber;
                        Integer randomNumber2 = Integer.valueof((Math.random() * 15));
                        Integer mana = 50 - randomNumber2;
                        
                        Ability__c temp = new Ability__c(Pokemon__c = myPoke.Id, Ability_Name__c = abiName, Base_Damage__c = abiDmg, MP_Cost__c = mana);
                        myAbi.add(temp);
                    }
                    else{
                        break;
                    }
                }
                
                
                
                insert myAbi;
                return true;
            }
            else{
                return false;
            }
        }
        
    
}