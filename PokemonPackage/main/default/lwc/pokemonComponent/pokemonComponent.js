import { LightningElement, api, wire } from 'lwc';
import getAbilityFromPokemon from '@salesforce/apex/pokemonClass.getAbilityFromPokemon';

import { subscribe, MessageContext } from 'lightning/messageService';
import OPPONENT_BATTLE_CHANNEL from '@salesforce/messageChannel/opponentBattle__c';

export default class PokemonComponent extends LightningElement {
    @api pokemon;
    @api isyourpokemon;
    @api isactive = false;
    @api HP;
    @api currentactive;

    

    @wire(getAbilityFromPokemon, {pokemon :'$pokemon'}) myabilities;

    connectedCallback() {
        this.HP = this.pokemon.HP__c;
        this.subscribeToMessageChannel();
    }

    
    
    myclick(event){
        //console.log('Pokemon Using Ability: '+event.target.label);
        let abiName = event.target.label;
        let abiDamage = this.searchForAbilityDamage(this.myabilities.data, abiName);
        //console.log(abiDamage);
        this.dispatchEvent(new CustomEvent('attack',{
            detail:{
                pokemon_id: this.pokemon.Id,
                ability_name: abiName,
                ability_damage: abiDamage
            }
            //ability_damage: abiDamage
        }));
        this.HP--;
    }



    searchForAbilityDamage(abiList, abiName){
        for(let i in abiList){
            if(abiList[i].Ability_Name__c === abiName){
                return abiList[i].Damage__c;
            }
        }
    }

    pickPoke(){
        if(this.currentactive<1){
            this.dispatchEvent(new CustomEvent('picking'));
            this.isactive = true;
        }
       
        //CREATE APEX FUNCTIONS TO MAKE THE POKEMON BE ACTIVE/INACTIVE
    }

    retrievePoke(){
        if(this.isactive == true){
            this.dispatchEvent(new CustomEvent('retrieve'));
            this.isactive = false;
        }
        
    }

    @wire(MessageContext)
    messageContext;
    subscribeToMessageChannel() {
        this.subscription = subscribe(
        this.messageContext,
        OPPONENT_BATTLE_CHANNEL,
        (message) => this.handleMessage(message)
        );
    }

    handleMessage(message) {
        if(this.isactive){
            this.HP = Number(this.HP) - Number(message.damage);
            console.log(Number(this.HP));
        }
        
    }
    
}