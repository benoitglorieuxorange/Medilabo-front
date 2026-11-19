import { Adresse } from './adresse.model';

export interface CaseModel {
    id: string;
    firstName: string;
    lastName: string;
    dateNaissance: string;
    sexe: 'M' | 'F';
    adresse: Adresse;
    phoneNumber: string;
    status: 'ACTIVE' | 'ARCHIVED';
}

// Pour la création d'un utilisateur, on omet l'ID car il sera généré par le serveur
export type CaseCreateModel = Omit<CaseModel, 'id'>;
