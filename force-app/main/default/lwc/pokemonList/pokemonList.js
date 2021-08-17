import { LightningElement, api, wire } from 'lwc';
import searchPokemon from '@salesforce/apex/pokemonClass.searchPokemon';

export default class PokemonList extends LightningElement {
    searchTerm='';
    @api pokemons= null;
    @wire(searchPokemon, {searchTerm :'$searchTerm'}) pokemons;

    handleSearchTermChange(event){
        // Debouncing this method: do not update the reactive property as
		// long as this function is being called within a delay of 300 ms.
		// This is to avoid a very large number of Apex method calls.
		window.clearTimeout(this.delayTimeout);
        const searchTerm = event.target.value;
        this.delayTimeout = setTimeout(() => {
			this.searchTerm = searchTerm;
		}, 300);
    }

}