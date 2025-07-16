export interface TFactureFournisseur{
	id:number,
	numero:string,
	date:Date,
	montant:number,
	fournisseur:string,
	idFournisseur:number,
	matriculeFiscal:string,
	dateCreation?:Date,
	dateModification?:Date,
}