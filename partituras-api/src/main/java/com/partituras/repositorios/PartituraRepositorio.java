package com.partituras.repositorios;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.partituras.entidades.Partitura;

public interface PartituraRepositorio extends JpaRepository<Partitura, Long> {

    boolean existsByCompositorId(Long compositorId);

    Page<Partitura> findByTituloContainingIgnoreCaseOrCompositorNomeContainingIgnoreCase(
            String titulo, String compositor, Pageable paginacao);
}
