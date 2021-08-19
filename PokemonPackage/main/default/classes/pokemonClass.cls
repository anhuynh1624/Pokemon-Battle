public with sharing class pokemonClass {
	
    //GETTING A POKEMON LIST USED FOR THE FUNCTION BELOW
    @AuraEnabled(Cacheable=true)
    public static List<Pokemon__c> getPokemonList(){
        try {
            return [SELECT Name, Pokemon_Name__c, Type__c, HP__c, Average_Damage__c, Defense__c, Pokemon_Front__c, Pokemon_Back__c
             FROM Pokemon__c WHERE OwnerId =: UserInfo.getUserId() WITH SECURITY_ENFORCED];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    //GETTING A LIST OF OWNED POKEN BY A SEARCH KEYWORD USE IN MY POKEMON (pokemonList)
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


    //MATCHING YOUR TEAM TO ANOTHER TEAM FOR THE BATTLE INDEX [0] WILL BE YOUR TEAM, [1] WILL BE OPPONENT TEAM
    @AuraEnabled(Cacheable=true)
    public static List<Team__c> matchingTeam(){
        List<Team__c> teamList = new List<Team__c>();
        teamList.add([SELECT Name, Pokemon_1__c, Pokemon_2__c, Pokemon_3__c, Team_Damage_Rating__c, Queue__c FROM Team__c WHERE OwnerId =: UserInfo.getUserId() LIMIT 1]);
        Decimal myRating = teamList[0].Team_Damage_Rating__c;
        List<Team__c> temp = [SELECT Name, Pokemon_1__c, Pokemon_2__c, Pokemon_3__c, Team_Damage_Rating__c, Queue__c FROM Team__c WHERE OwnerId !=: UserInfo.getUserId()];
        
        for(Team__c t: temp){
            if(myRating - t.Team_Damage_Rating__c < 100 || myRating - t.Team_Damage_Rating__c > -100){
                teamList.add(t);
                break;
            }
        }

        return teamList;
    }

    //GET POKEMON LIST FROM A TEAM
    @AuraEnabled(Cacheable=true)
    public static List<Pokemon__c> getPokemonFromTeam(Team__c team){
        List<Id> pokeId = new List<Id>();
        pokeId.add(team.Pokemon_1__c);
        pokeId.add(team.Pokemon_2__c);
        pokeId.add(team.Pokemon_3__c);

        List<Pokemon__c> result = [SELECT Name, Battle_HP__c, Pokemon_Name__c, Type__c, HP__c, Average_Damage__c, Defense__c, Pokemon_Front__c, Pokemon_Back__c, isActive__c
        FROM Pokemon__c WHERE Id=:pokeId WITH SECURITY_ENFORCED LIMIT 3];

        for(Pokemon__c poke : result){
            poke.Battle_HP__c = poke.HP__c;
        }

        //update result;
        return result;
    }

    //GET ABILITY FROM A POKEMON
    @AuraEnabled(Cacheable=true)
    public static List<Ability__c> getAbilityFromPokemon(Pokemon__c pokemon){
        return [SELECT Ability_Name__c, Damage__c, MP_Cost__c FROM Ability__c WHERE Pokemon__c =:pokemon.Id LIMIT 2];
    }

    
        
}