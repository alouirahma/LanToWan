// package ltw.projetltw.mappers;

// import ltw.projetltw.dtos.requests.FournisseurRequest;
// import ltw.projetltw.dtos.responses.FournisseurResponse;
// import ltw.projetltw.entities.Fournisseur;

// import org.mapstruct.*;

// @Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
// public interface FournisseurMapper {
//     FournisseurResponse toDto(Fournisseur fournisseur);

//     @Mapping(target = "id", ignore = true)
//     Fournisseur toEntity(FournisseurRequest fournisseurRequest);

//     @Mapping(target = "id", ignore = true)
//     void updateEntityFromDto(FournisseurRequest fournisseurRequest, @MappingTarget Fournisseur fournisseur);
// }