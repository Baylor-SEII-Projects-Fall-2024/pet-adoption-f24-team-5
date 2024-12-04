package petadoption.api.pet;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;

import java.util.Collection;
import java.util.List;
import java.util.Optional;


public interface PetRepository extends JpaRepository<Pet, Integer> {
    Optional<List<Pet>> findByAdoptionCenter(AdoptionCenter adoptionCenter);

    Optional<Pet> findByPetId(long petId);

    Optional<List<Pet>> findByPetIdIn(Collection<Long> ids);

    @Query("SELECT DISTINCT p.species FROM Pet p")
    List<String> findDistinctSpecies();

    @Query("SELECT p FROM Pet p WHERE p.species = :species ORDER BY RAND() LIMIT 1")
    Pet findRandomPetBySpecies(@Param("species") String species);
}
