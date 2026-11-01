package com.partituras.repositorios;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;

import com.partituras.entidades.Compositor;
import com.partituras.entidades.Partitura;
import com.partituras.entidades.SessaoEstudo;

@DataJpaTest(showSql = false, properties = {
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.properties.hibernate.hbm2ddl.skip_default_import_file=true"
})
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
class SessaoEstudoRepositorioTests {

    @Autowired
    private SessaoEstudoRepositorio repositorio;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    void buscarPorCompositorDeveRetornarSessoesDeTodasAsSuasPartituras() {
        // Arrange
        Compositor beethoven = salvarCompositor("Beethoven");
        Compositor mozart = salvarCompositor("Mozart");
        Partitura furElise = salvarPartitura("Für Elise", beethoven);
        Partitura sonata = salvarPartitura("Sonata ao Luar", beethoven);
        Partitura marchaTurca = salvarPartitura("Marcha Turca", mozart);
        SessaoEstudo primeiraSessao = salvarSessao(furElise, 20);
        SessaoEstudo segundaSessao = salvarSessao(furElise, 30);
        SessaoEstudo terceiraSessao = salvarSessao(sonata, 15);
        salvarSessao(marchaTurca, 40);
        entityManager.flush();
        entityManager.clear();

        // Act
        List<SessaoEstudo> sessoes = repositorio.buscarPorCompositor(beethoven.getId());

        // Assert
        assertThat(sessoes)
                .extracting(SessaoEstudo::getId)
                .containsExactlyInAnyOrder(
                        primeiraSessao.getId(), segundaSessao.getId(), terceiraSessao.getId());
    }

    @Test
    void buscarPorCompositorDeveRetornarListaVaziaQuandoNaoHouverEstudos() {
        // Arrange
        Compositor beethoven = salvarCompositor("Beethoven");
        Compositor mozart = salvarCompositor("Mozart");
        salvarPartitura("Für Elise", beethoven);
        Partitura marchaTurca = salvarPartitura("Marcha Turca", mozart);
        salvarSessao(marchaTurca, 40);
        entityManager.flush();
        entityManager.clear();

        // Act
        List<SessaoEstudo> sessoes = repositorio.buscarPorCompositor(beethoven.getId());

        // Assert
        assertThat(sessoes).isEmpty();
    }

    @Test
    void buscarPorCompositorDeveRetornarListaVaziaQuandoCompositorNaoExistir() {
        // Arrange
        Compositor compositor = salvarCompositor("Beethoven");
        Partitura partitura = salvarPartitura("Für Elise", compositor);
        salvarSessao(partitura, 25);
        Long compositorInexistenteId = Long.MAX_VALUE;
        entityManager.flush();
        entityManager.clear();

        // Act
        List<SessaoEstudo> sessoes = repositorio.buscarPorCompositor(compositorInexistenteId);

        // Assert
        assertThat(sessoes).isEmpty();
    }

    @Test
    void totalMinutosPorPartituraDeveSomarApenasOsEstudosDaPartituraInformada() {
        // Arrange
        Compositor compositor = salvarCompositor("Beethoven");
        Partitura furElise = salvarPartitura("Für Elise", compositor);
        Partitura sonata = salvarPartitura("Sonata ao Luar", compositor);
        salvarSessao(furElise, 20);
        salvarSessao(furElise, 25);
        salvarSessao(furElise, 10);
        salvarSessao(sonata, 90);
        entityManager.flush();
        entityManager.clear();

        // Act
        Long totalMinutos = repositorio.totalMinutosPorPartitura(furElise.getId());

        // Assert
        assertThat(totalMinutos).isEqualTo(55L);
    }

    @Test
    void totalMinutosPorPartituraDeveRetornarZeroQuandoNaoHouverEstudos() {
        // Arrange
        Compositor compositor = salvarCompositor("Beethoven");
        Partitura furElise = salvarPartitura("Für Elise", compositor);
        Partitura sonata = salvarPartitura("Sonata ao Luar", compositor);
        salvarSessao(sonata, 30);
        entityManager.flush();
        entityManager.clear();

        // Act
        Long totalMinutos = repositorio.totalMinutosPorPartitura(furElise.getId());

        // Assert
        assertThat(totalMinutos).isZero();
    }

    @Test
    void totalMinutosPorPartituraDeveRetornarZeroQuandoPartituraNaoExistir() {
        // Arrange
        Compositor compositor = salvarCompositor("Beethoven");
        Partitura partitura = salvarPartitura("Für Elise", compositor);
        salvarSessao(partitura, 25);
        Long partituraInexistenteId = Long.MAX_VALUE;
        entityManager.flush();
        entityManager.clear();

        // Act
        Long totalMinutos = repositorio.totalMinutosPorPartitura(partituraInexistenteId);

        // Assert
        assertThat(totalMinutos).isZero();
    }

    private Compositor salvarCompositor(String nome) {
        return entityManager.persist(Compositor.builder()
                .nome(nome)
                .build());
    }

    private Partitura salvarPartitura(String titulo, Compositor compositor) {
        return entityManager.persist(Partitura.builder()
                .titulo(titulo)
                .compositor(compositor)
                .build());
    }

    private SessaoEstudo salvarSessao(Partitura partitura, int minutos) {
        return entityManager.persist(SessaoEstudo.builder()
                .partitura(partitura)
                .data(LocalDate.of(2026, 11, 1))
                .minutos(minutos)
                .build());
    }
}
