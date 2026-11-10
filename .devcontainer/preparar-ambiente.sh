#!/usr/bin/env bash
set -euo pipefail

bash .devcontainer/init-mysql.sh
npm --prefix partituras-mcp ci
npm --prefix partituras-mcp run build
npm --prefix partituras-site ci

# Para usar a versão Python, habilite sua feature no devcontainer.json e esta linha:
# python -m pip install -e ./partituras-mcp-old

mvn -B -f partituras-api/pom.xml -DskipTests package
