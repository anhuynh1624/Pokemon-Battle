import { LightningElement, api, wire, track } from 'lwc';
import getPokemonFromTeam from '@salesforce/apex/pokemonClass.getPokemonFromTeam';
import { publish, MessageContext } from 'lightning/messageService';
import POKEMON_BATTLE_CHANNEL from '@salesforce/messageChannel/pokemonBattle__c';


export default class TeamComponent extends LightningElement {
    @api myteam;
    @api ismyteam;
    @api mypokemons;
    falseValue = false;
    activenum = 0;
    temp;
    trueValue = true;
    activePokemon;
    logs=[];
    activepokemonid;
    //pokemonName;
    @wire(getPokemonFromTeam, {team :'$myteam'}) mypokemons;
    

    //@wire(updatePokemonStatus, {pokelist : '$mypokemons', pokeId : '$activepokemonId'}) t;
    
    @wire(MessageContext) messageContext;

    

    printMe(event){
        //CATCHING THE EVENT AND GET INFORMATION FROM POKEMONCOMPONENT
        let abiName = event.detail.ability_name;
        let abiDamage = event.detail.ability_damage;
        let pokeId = event.detail.pokemon_id;
        this.activePokemon = pokeId;
        let pokemon = this.searchForPokemon(pokeId, this.mypokemons.data);
        let tempString = "---------Your Turn - Pokemon "+pokemon.Pokemon_Name__c+" is using "+abiName;
        //this.pokemons = this.mypokemons.data;
        
        //console.log(this.mypokemons.data[0]);
        this.logs = this.logs + tempString;
        

        //PUBLIST THE ATTACK SO THE OPPONENTCOMPONENT CAN RECIEVE THE SIGNAL TO WORK WITH ITS DATA
        const payload ={
            pokemonName: pokemon.Pokemon_Name__c,
            ability: abiName,
            damage: abiDamage
        }
        publish(this.messageContext, POKEMON_BATTLE_CHANNEL, payload);
        
    }
    
    searchForPokemon(id, pokes){
        for(let i in pokes){
            if(id == pokes[i].Id){
                return pokes[i];
            }
        }
        //console.log(this.myteam.Pokemon_1__c);
    }
    
    pickMe(event){
        this.activenum++;
        //console.log(this.activenum);
    //MAKE APEX TO CHANGE THE DATA IN POKEMON AND RESET HP/UPDATE EXP AFTER THE MATCH
    }
    retrieveMe(event){
        this.activenum--;
        if(this.activenum<0){
            this.activenum = 0;
        }
        //console.log(this.activenum);
    }
}