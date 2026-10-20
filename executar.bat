@echo off
chcp 65001 > nul
title Sistema de E-Commerce - Lucas Werner
echo ======================================================================
echo          SISTEMA DE GERENCIAMENTO DE E-COMMERCE (CONSOLE)
echo          Desenvolvedor: Lucas Cachoeira Werner - Turma 6 Ciclo 2
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/2] Compilando arquivos TypeScript (npm run build)...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Ocorreu uma falha durante a compilação.
    echo.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Executando aplicação compilada com Node.js...
echo.
node dist/main.js

echo.
echo ======================================================================
echo                    EXECUÇÃO CONCLUÍDA
echo ======================================================================
echo Pressione qualquer tecla para fechar esta janela...
pause > nul
