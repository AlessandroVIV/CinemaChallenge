export interface IPosto {
    fila: number;
    posto: string;
}

export interface IPrenotazione { 
    postiPrenotati: string[],
    film: string;      
    data: Date;
    orario: string;
}

export interface IUtente { 
    id: number; 
    nome: string; 
    email: string;
    telefono: string;
    prenotazioniUtente: IPrenotazione[]; 
}

export interface IFilm {
    id: number;
    titolo: string;
    copertina: string;
    descrizione: string;
    durata: number;
    genere: string;
    dataUscita: Date;
    lingua: string;
    imgDettaglio: string;
    rating: string | number;
    orarioPrenotazione: IPrenotazione[];
}



