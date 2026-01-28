@echo off
title Estructura de Carpetas
color 0A
cls

echo Generando lista de archivos y carpetas...
echo.

REM Obtener fecha y hora para el nombre del archivo
for /f "tokens=1-3 delims=/ " %%a in ("%date%") do (
    set dia=%%a
    set mes=%%b
    set ano=%%c
)
for /f "tokens=1-3 delims=:." %%a in ("%time%") do (
    set hora=%%a
    set minuto=%%b
    set segundo=%%c
)

REM Asegurar 2 dígitos
if %hora% LSS 10 set hora=0%hora%
if %minuto% LSS 10 set minuto=0%minuto%
if %segundo% LSS 10 set segundo=0%segundo%

set "archivo_salida=estructura_%ano%%mes%%dia%_%hora%%minuto%%segundo%.txt"

echo Fecha: %date% %time% > "%archivo_salida%"
echo Carpeta: %cd% >> "%archivo_salida%"
echo. >> "%archivo_salida%"
echo ================================= >> "%archivo_salida%"
echo ESTRUCTURA COMPLETA >> "%archivo_salida%"
echo ================================= >> "%archivo_salida%"
echo. >> "%archivo_salida%"

REM Listar TODOS los archivos y carpetas
dir /s /a >> "%archivo_salida%"

echo.
echo ¡Archivo generado exitosamente!
echo Nombre: %archivo_salida%
echo.
echo Abriendo el archivo...
timeout /t 2 /nobreak > nul

start "" "%archivo_salida%"
echo.
pause