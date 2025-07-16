export interface TSupplierInvoice{
	id:number,
	code:string,
	date:Date,
	destinateur:string,
	idDestinateur:number,
	matriculeFiscal:string,
	paiement:number,
	dateCreation?:Date,
	dateModification?:Date,
}