export interface TFactureFournisseurAchatProduit {
  id: number
  idAchat: number
  idProduit: number
  reference: string
  produit: string
  quantite: number
  prixUnitaire: number
  tax?: number
  remise?: number
  dateCreation?: Date
  dateModification?: Date
}
