import {ITopico} from './ITopicos';

export class Topico implements ITopico {
    public id: number;
    public value: string;
    public sourceNote: string;
}