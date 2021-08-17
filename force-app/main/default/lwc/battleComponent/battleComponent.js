import { LightningElement, api, wire } from 'lwc';
import matchingTeam from '@salesforce/apex/pokemonClass.matchingTeam';

export default class BattleComponent extends LightningElement {
    inQueue = false;
    @api mteam;
    @api opponentteam;
    trueValue = true;
    falseValue = false;

    findOpponent(){
        

        matchingTeam()
        .then(result =>{
           this.mteam = result[0];
           this.opponentteam = result[1];          
           this.inQueue = true;

        })
        .catch(error =>{
            //some code
        });
    }
    
}