@echo off
chcp 65001 > nul
title Sistema de E-Commerce - Lucas Werner
echo ======================================================================
echo          SISTEMA DE GERENCIAMENTO DE E-COMMERCE (CONSOLE)
echo          Desenvolvedor: Lucas Cachoeira Werner - Turma 6 Ciclo 2
echo ======================================================================
echo.
cd /d "%~dp0"
echo [1/2] Compilando arquivos TypeScript...
call npm.cmd run build
if %errorlevel% neq 0 (
    echo [ERRO] Falha na compilacao.
    pause
    exit /b %errorlevel%
)
echo.
echo [2/2] Executando aplicacao com Node.js...
echo.
node dist/main.js
echo.
echo ======================================================================
echo                    EXECUCAO CONCLUIDA
echo ======================================================================
echo Pressione qualquer tecla para fechar esta janela...
pause > nul