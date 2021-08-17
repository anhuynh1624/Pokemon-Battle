import { LightningElement, api } from 'lwc';
import pokeResources from '@salesforce/resourceUrl/PokeBall';
export default class Pokemon extends LightningElement {
    @api pokemon;
	appResources = {
		pokeSilhouette: `${pokeResources}`,
	};

    

}