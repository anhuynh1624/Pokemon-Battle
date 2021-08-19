import { LightningElement,api, wire, } from 'lwc';

import getPokemonFromTeam from '@salesforce/apex/pokemonClass.getPokemonFromTeam';
import { publish, MessageContext } from 'lightning/messageService';
import OPPONENT_BATTLE_CHANNEL from '@salesforce/messageChannel/opponentBattle__c';


export default class OpponentTeamComponent extends LightningElement {
    @api myteam;
    @api ismyteam;
    falseValue = false;
    trueValue = true;
    @api pokemon1=[];
    status1=true;
    HP1=0;
    @api pokemon2=[];
    status2=false;
    HP2=0;
    @api pokemon3=[];
    status3=false;
    HP3=0;
    
    //@wire(getPokemonFromTeam, {team :'$myteam'}) mypokemons;
    @wire(MessageContext) messageContext2;

    connectedCallback() {
        
        
        getPokemonFromTeam({team: this.myteam})
        .then(mypokemons =>{
            this.pokemon1 = mypokemons[0];
            this.HP1 = this.pokemon1.HP__c;
            this.pokemon2 = mypokemons[1];
            this.HP2 = this.pokemon1.HP__c;
            this.pokemon3 = mypokemons[2];
            this.HP3 = this.pokemon1.HP__c;
        })
        
        //this.status1 = true;
    }

    pokeHandle(event){
        //console.log(event.detail.ability_damage);
        const payload ={
            damage: event.detail.ability_damage
        }
        //console.log(payload);
        publish(this.messageContext2, OPPONENT_BATTLE_CHANNEL, payload);
    }
}