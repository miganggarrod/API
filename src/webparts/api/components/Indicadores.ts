import {IIndicador} from './IIndicadores';

export class Indicador implements IIndicador {
    public id: string;
    public name: string;
    // public source: string;
    public sourceNote: string;
    public sourceOrganization: string;
}