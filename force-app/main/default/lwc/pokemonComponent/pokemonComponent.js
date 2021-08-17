import { LightningElement, api, wire } from 'lwc';
import getAbilityFromPokemon from '@salesforce/apex/pokemonClass.getAbilityFromPokemon';

export default class PokemonComponent extends LightningElement {
    @api pokemon;
    @api isyourpokemon;

    @wire(getAbilityFromPokemon, {pokemon :'$pokemon'}) myabilities;

    myclick(event){
        console.log('Pokemon Using Ability: '+event.target.label);
    }
}