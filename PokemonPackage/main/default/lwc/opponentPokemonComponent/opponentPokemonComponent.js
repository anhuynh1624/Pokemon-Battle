import { LightningElement, api, wire } from 'lwc';
import getAbilityFromPokemon from '@salesforce/apex/pokemonClass.getAbilityFromPokemon';

import { subscribe, MessageContext } from 'lightning/messageService';
import POKEMON_BATTLE_CHANNEL from '@salesforce/messageChannel/pokemonBattle__c';



export default class OpponentPokemonComponent extends LightningElement {
    @api pokemon;
    @api status;
    @api pokehp;
    

    @wire(getAbilityFromPokemon, {pokemon :'$pokemon'}) myabilities;

  


    @wire(MessageContext)
    messageContext;
    subscribeToMessageChannel() {
        this.subscription = subscribe(
        this.messageContext,
        POKEMON_BATTLE_CHANNEL,
        (message) => this.handleMessage(message)
        );
    }

    handleMessage(message) {
        if(this.status == true){
            //console.log(message.pokemonName+" is using "+message.ability+" with "+message.damage+" damage");
            this.pokehp = this.pokehp - message.damage;

            let abi1 = this.myabilities.data[0].Damage__c;
           
            this.dispatchEvent(new CustomEvent('picking',{
                detail:{
                    //hp: this.HP
                    ability_damage: abi1
                }
                
            }));

           
        }
    }

    connectedCallback() {
        //this.pokeHP = this.pokemon.HP__c;
        //console.log(this.pokehp);
        this.subscribeToMessageChannel();
    }
}