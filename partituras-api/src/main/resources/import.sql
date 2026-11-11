-- Compositores
INSERT INTO compositores (id, nome, ano_nascimento, ano_falecimento) VALUES (1, 'Ludwig van Beethoven', 1770, 1827);
INSERT INTO compositores (id, nome, ano_nascimento, ano_falecimento) VALUES (2, 'Wolfgang Amadeus Mozart', 1756, 1791);
INSERT INTO compositores (id, nome, ano_nascimento, ano_falecimento) VALUES (3, 'Johann Sebastian Bach', 1685, 1750);
INSERT INTO compositores (id, nome, ano_nascimento, ano_falecimento) VALUES (4, 'Frédéric Chopin', 1810, 1849);
INSERT INTO compositores (id, nome, ano_nascimento, ano_falecimento) VALUES (5, 'Heitor Villa-Lobos', 1887, 1959);

-- Partituras (os links do IMSLP podem exigir JavaScript no navegador)
INSERT INTO partituras (id, titulo, instrumento, dificuldade, status, caminho_pdf, compositor_id) VALUES (1, 'Für Elise', 'Piano', 'INICIANTE', 'Em andamento', 'https://imslp.org/wiki/Special:ImagefromIndex/318757', 1);
INSERT INTO partituras (id, titulo, instrumento, dificuldade, status, caminho_pdf, compositor_id) VALUES (2, 'Marcha Turca', 'Piano', 'AVANCADO', 'Em andamento', 'https://imslp.org/wiki/Special:ImagefromIndex/56321', 2);
INSERT INTO partituras (id, titulo, instrumento, dificuldade, status, caminho_pdf, compositor_id) VALUES (3, 'Prelúdio em Dó Maior', 'Piano', 'INICIANTE', 'Concluída', 'https://imslp.org/wiki/Special:ImagefromIndex/425317', 3);
INSERT INTO partituras (id, titulo, instrumento, dificuldade, status, caminho_pdf, compositor_id) VALUES (4, 'Prelúdio em Mi Menor', 'Piano', 'INTERMEDIARIO', 'Não iniciada', 'https://imslp.org/wiki/Special:ImagefromIndex/254000', 4);
INSERT INTO partituras (id, titulo, instrumento, dificuldade, status, caminho_pdf, compositor_id) VALUES (5, 'O Trenzinho do Caipira', 'Orquestra', 'AVANCADO', 'Não iniciada', 'https://imslp.org/wiki/Special:ImagefromIndex/40957', 5);
INSERT INTO partituras (id, titulo, instrumento, dificuldade, status, caminho_pdf, compositor_id) VALUES (6, 'Sonata ao Luar', 'Piano', 'AVANCADO', 'Em andamento', 'https://imslp.org/wiki/Special:ImagefromIndex/32718', 1);
INSERT INTO partituras (id, titulo, instrumento, dificuldade, status, caminho_pdf, compositor_id) VALUES (7, 'Sonata Patética', 'Piano', 'AVANCADO', 'Não iniciada', 'https://imslp.org/wiki/Special:ImagefromIndex/00008', 1);
INSERT INTO partituras (id, titulo, instrumento, dificuldade, status, caminho_pdf, compositor_id) VALUES (8, 'Sinfonia nº 5', 'Orquestra', 'AVANCADO', 'Não iniciada', 'https://imslp.org/wiki/Special:ImagefromIndex/575951', 1);
INSERT INTO partituras (id, titulo, instrumento, dificuldade, status, caminho_pdf, compositor_id) VALUES (9, 'Sonata Appassionata', 'Piano', 'AVANCADO', 'Não iniciada', 'https://imslp.org/wiki/Special:ImagefromIndex/04078', 1);
INSERT INTO partituras (id, titulo, instrumento, dificuldade, status, caminho_pdf, compositor_id) VALUES (10, 'Sonata para Piano em Dó Maior, K. 545', 'Piano', 'INTERMEDIARIO', 'Em andamento', 'https://imslp.org/wiki/Special:ImagefromIndex/56442', 2);
INSERT INTO partituras (id, titulo, instrumento, dificuldade, status, caminho_pdf, compositor_id) VALUES (11, 'Eine kleine Nachtmusik', 'Cordas', 'INTERMEDIARIO', 'Não iniciada', 'https://imslp.org/wiki/Special:ImagefromIndex/01776', 2);
INSERT INTO partituras (id, titulo, instrumento, dificuldade, status, caminho_pdf, compositor_id) VALUES (12, 'Fantasia em Ré Menor, K. 397', 'Piano', 'INTERMEDIARIO', 'Não iniciada', 'https://imslp.org/wiki/Special:ImagefromIndex/474097', 2);
INSERT INTO partituras (id, titulo, instrumento, dificuldade, status, caminho_pdf, compositor_id) VALUES (13, 'Concerto para Piano nº 21', 'Piano e orquestra', 'AVANCADO', 'Não iniciada', 'https://imslp.org/wiki/Special:ImagefromIndex/442212', 2);
INSERT INTO partituras (id, titulo, instrumento, dificuldade, status, caminho_pdf, compositor_id) VALUES (14, 'Invenção a Duas Vozes nº 1', 'Piano', 'INTERMEDIARIO', 'Concluída', 'https://imslp.org/wiki/Special:ImagefromIndex/00747', 3);
INSERT INTO partituras (id, titulo, instrumento, dificuldade, status, caminho_pdf, compositor_id) VALUES (15, 'Invenção a Duas Vozes nº 8', 'Piano', 'INTERMEDIARIO', 'Em andamento', 'https://imslp.org/wiki/Special:ImagefromIndex/00754', 3);
INSERT INTO partituras (id, titulo, instrumento, dificuldade, status, caminho_pdf, compositor_id) VALUES (16, 'Suíte para Violoncelo nº 1', 'Violoncelo', 'AVANCADO', 'Não iniciada', 'https://imslp.org/wiki/Special:ImagefromIndex/01298', 3);
INSERT INTO partituras (id, titulo, instrumento, dificuldade, status, caminho_pdf, compositor_id) VALUES (17, 'Concerto de Brandemburgo nº 3', 'Cordas', 'AVANCADO', 'Não iniciada', 'https://imslp.org/wiki/Special:ImagefromIndex/02041', 3);
INSERT INTO partituras (id, titulo, instrumento, dificuldade, status, caminho_pdf, compositor_id) VALUES (18, 'Noturno em Mi Bemol Maior, Op. 9 nº 2', 'Piano', 'INTERMEDIARIO', 'Em andamento', 'https://imslp.org/wiki/Special:ImagefromIndex/441698', 4);
INSERT INTO partituras (id, titulo, instrumento, dificuldade, status, caminho_pdf, compositor_id) VALUES (19, 'Valsa em Lá Menor, B. 150', 'Piano', 'INTERMEDIARIO', 'Concluída', 'https://imslp.org/wiki/Special:ImagefromIndex/55093', 4);
INSERT INTO partituras (id, titulo, instrumento, dificuldade, status, caminho_pdf, compositor_id) VALUES (20, 'Estudo Revolucionário', 'Piano', 'AVANCADO', 'Não iniciada', 'https://imslp.org/wiki/Special:ImagefromIndex/844284', 4);
INSERT INTO partituras (id, titulo, instrumento, dificuldade, status, caminho_pdf, compositor_id) VALUES (21, 'Balada nº 1 em Sol Menor', 'Piano', 'AVANCADO', 'Não iniciada', 'https://imslp.org/wiki/Special:ImagefromIndex/548218', 4);
INSERT INTO partituras (id, titulo, instrumento, dificuldade, status, caminho_pdf, compositor_id) VALUES (22, 'Prelúdio nº 1 para violão', 'Violão', 'INTERMEDIARIO', 'Em andamento', 'https://imslp.org/wiki/Special:ImagefromIndex/944816', 5);
INSERT INTO partituras (id, titulo, instrumento, dificuldade, status, caminho_pdf, compositor_id) VALUES (23, 'Prelúdio nº 2 para violão', 'Violão', 'AVANCADO', 'Não iniciada', 'https://imslp.org/wiki/Special:ImagefromIndex/944816', 5);
INSERT INTO partituras (id, titulo, instrumento, dificuldade, status, caminho_pdf, compositor_id) VALUES (24, 'Estudo nº 1 para violão', 'Violão', 'AVANCADO', 'Não iniciada', 'https://imslp.org/wiki/Special:ImagefromIndex/273548', 5);
INSERT INTO partituras (id, titulo, instrumento, dificuldade, status, caminho_pdf, compositor_id) VALUES (25, 'Chôros nº 1', 'Violão', 'AVANCADO', 'Não iniciada', 'https://imslp.org/wiki/Special:ImagefromIndex/973163', 5);

-- Sessões de estudo (partituras 1 a 3)
INSERT INTO sessoes_estudo (id, partitura_id, data, minutos, observacoes) VALUES (1, 1, '2026-10-20', 25, 'Estudo da introdução com as mãos separadas.');
INSERT INTO sessoes_estudo (id, partitura_id, data, minutos, observacoes) VALUES (2, 1, '2026-10-21', 30, 'Prática da primeira seção com metrônomo.');
INSERT INTO sessoes_estudo (id, partitura_id, data, minutos, observacoes) VALUES (3, 2, '2026-10-22', 40, 'Treino lento das passagens rápidas.');
INSERT INTO sessoes_estudo (id, partitura_id, data, minutos, observacoes) VALUES (4, 3, '2026-10-23', 20, 'Revisão dos arpejos e das mudanças de acorde.');
INSERT INTO sessoes_estudo (id, partitura_id, data, minutos, observacoes) VALUES (5, 3, '2026-10-24', 15, 'Execução completa para revisar a peça.');
