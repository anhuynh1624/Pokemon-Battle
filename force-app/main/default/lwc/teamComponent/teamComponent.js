import { LightningElement, api, wire, track } from 'lwc';
import getPokemonFromTeam from '@salesforce/apex/pokemonClass.getPokemonFromTeam';


export default class TeamComponent extends LightningElement {
    @api myteam;
    @api ismyteam;
    falseValue = false;
    trueValue = true;
    //pokemonName;
    @wire(getPokemonFromTeam, {team :'$myteam'}) mypokemons;
    
    myclick(){
        //this.pokemonName = this.mypokemons.data.Name;
        //console.log('Clicking');
        console.log(this.myteam.Pokemon_1__c);
    }
    
}