package com.partituras.entidades;

import com.partituras.entidades.enums.Dificuldade;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "partituras")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Partitura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    private String instrumento;

    @Enumerated(EnumType.STRING)
    private Dificuldade dificuldade;

    private String status;

    private String caminhoPdf;

    @ManyToOne(optional = false)
    @JoinColumn(name = "compositor_id", nullable = false)
    private Compositor compositor;
}
