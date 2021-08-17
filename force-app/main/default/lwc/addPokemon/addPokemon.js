import { LightningElement, wire, api } from 'lwc';
import callPoke from '@salesforce/apex/callPokemonAPI.callPoke';

export default class AddPokemon extends LightningElement {
    myCheck = true;
    showAdding = true;
    isError = false;
    isPokemonNotExist = false;
    poName="pikachu";
    errorMes ="";
    //@wire(callPoke, {pokeName: '$poName'}) myCheck;
    addNewPoke(){
        this.poName = this.template.querySelector(".inputName").value.toLowerCase();

        callPoke({pokeName: this.poName})
        .then(myCheck =>{
            if(myCheck == true){
                this.showAdding = false;
            }
            else{
                this.isPokemonNotExist = true;
            }
        })
        .catch(error =>{
            this.isError = true;
            this.errorMes = error.message;
        });
    }
   
}