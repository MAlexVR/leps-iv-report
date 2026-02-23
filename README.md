# LEPS — Ensayo estacionario de trazado curva I‐V y determinación de punto máximo de potencia (MPP)

Aplicación web para la captura, análisis y generación estructurada del informe del ensayo estacionario de trazado curva I‐V y determinación de punto máximo de potencia (MPP), procesando automáticamente los datos de adquisición (DAQ) del simulador de sol GSola asegurando el cumplimiento con los estándares normativos, especialmente la norma **IEC 60904-1 Ed.3 (2020-09)**.

Desarrollado para el **Laboratorio de Ensayos para Paneles Solares (LEPS)** del Centro de Electricidad, Electrónica y Telecomunicaciones (CEET) — SENA, Bogotá D.C.

**Autor:**
Ing. Mauricio Alexander Vargas Rodríguez, MSc., MBA Esp. PM.
Instructor G14 del área de telecomunicaciones

> Migración y refactorización web del antiguo aplicativo de escritorio **DAQAnalyzer** (Python/PyQt6).

---

## Características Principales

- **Procesamiento completo de datos DAQ**: parseo de SunData CSV (UTF-16-LE), archivos de curva I-V calibrados (`*-cali.daq`) y capturas JPG del equipo de medición.
- **Matching por timestamp**: las imágenes JPG determinan qué archivos DAQ se procesan (lógica fiel al DAQAnalyzer Python).
- **Datos del ensayo**: extracción automática de metadatos constantes del CSV (Test_Date, Manuf, Area, STime, SDirection).
- **Análisis gráfico automatizado**: cálculo de Voc, Isc, Pmax, Vpm, Ipm y FF a partir de la curva I-V promedio.
- **Visualización de curvas**: gráficas interactivas de curvas I-V individuales superpuestas (repetibilidad) y curva I-V / P-V promedio con punto MPP.
- **Tablas SunData**: tabla completa de todas las mediciones y promedios por columna (columnas visibles, excluyendo las ocultas igual que en el DAQAnalyzer).
- **Pre-llenado automático**: los resultados del procesamiento alimentan los pasos del wizard (condiciones de medición, resultados, etc.).
- **Generación de PDF en formato Carta**: informe multi-página con paginación dinámica, header/footer institucional en cada página y numeración correcta.
- **Arquitectura de Activos Optimizada**: los recursos gráficos y tipografías están aislados en `public/assets/` y `public/fonts/` (con tipografía local Roboto preconfigurada), siguiendo los lineamientos de diseño atómico.
- **Sistema Integrado de Skills de IA**: contiene directrices y reglas estrictas de desarrollo bajo el estándar SENA, alojadas de forma nativa en `.agents/skills/sena-simulator-dev/SKILL.md`.

## Estructura de Directorios (Arquitectura Atómica)

El proyecto sigue una estricta arquitectura basada en metodologías modulares y diseño atómico:

```text
/
├── public/                 # Assets (fuera del bundle principal)
│   ├── assets/
│   │   ├── logos/          # Logos institucionales (SENA, LEPS, etc.)
│   │   ├── icons/          # Íconos estáticos (.svg, .png)
│   │   └── images/         # Elementos gráficos no-iconográficos
│   └── fonts/              # Fuentes locales (Roboto-*.ttf)
├── src/
│   ├── app/                # Next.js App Router (Páginas y API)
│   ├── components/         # Componentes UI (Atomic Design)
│   │   ├── atoms/          # Elementos indivisibles (Botones, Inputs)
│   │   ├── molecules/      # Agrupación de átomos (Campos de form con labels)
│   │   ├── organisms/      # Secciones complejas (Header, modales, gráficas)
│   │   └── templates/      # Estructura de vistas y contenedores mayores
│   ├── lib/                # Utilidades puras (parseo, generación PDF)
│   └── stores/             # Manejadores de estado (Zustand)
└── .agents/                # Skills y reglas cognitivas del agente AI
```

## Stack Tecnológico

| Tecnología               | Uso                                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Next.js 15+ (App Router) | Framework principal                                                                                                |
| React 19 / TypeScript    | UI Library y Tipado estático                                                                                       |
| Tailwind CSS 4           | Estilos visuales rediseñados y modernos, implementando localFonts (Roboto)                                         |
| UI Components            | Estructura basada en **Atomic Design** (Atoms, Molecules, Organisms, Templates) e integración con **Lucide Icons** |
| Zustand                  | Estado global de la aplicación (almacenamiento en memoria de todo el informe)                                      |
| Recharts                 | Visualización interactiva de curvas I-V y P-V                                                                      |
| jsPDF                    | Generación de informes PDF en formato Carta con paginación dinámica                                                |

_Nota: Todas las dependencias core y librerías clave se mantienen en sus versiones edge-stable más recientes._

## Instalación

```bash
cd leps-iv-report
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Archivos de Entrada DAQ

La aplicación requiere los archivos de salida del sistema de adquisición de datos del simulador de sol GSOLA:

| Archivo         | Descripción                                  | Formato                     |
| --------------- | -------------------------------------------- | --------------------------- |
| `None Name.csv` | SunData — parámetros eléctricos por medición | CSV (UTF-16-LE con BOM)     |
| `*-cali.daq`    | Curvas I-V calibradas (voltaje, corriente)   | Texto CSV (`V,I` por línea) |
| `*.jpg`         | Capturas de pantalla del equipo de medición  | JPEG                        |

## Flujo de Trabajo (Wizard de 8 Pasos)

La app está diseñada a través de un asistente paso a paso:

1. **Módulo y Cliente** — Identificación del módulo fotovoltaico bajo prueba y datos completos del cliente solicitante.
2. **Ítem de Ensayo** — Subida de 5 fotografías descriptivas del panel y formulario de observaciones físicas del módulo.
3. **Procedimiento** — Texto editable registrando el procedimiento detallado a seguir para la elaboración del ensayo.
4. **Condiciones** — Variables ambientales del laboratorio y condiciones del simulador (pre-llenadas según el archivo DAQ).
5. **Datos DAQ** — Carga de archivos _.csv, _.daq y \*.jpg para renderizar las curvas de la prueba y su validación cruzada.
6. **Resultados** — Declaración de la incertidumbre (editable) y confrontación paramétrica de mediciones versus valores nominales de la etiqueta del panel.
7. **Equipos y Referencias** — Base manejable en la memoria sobre equipos empleados durante la calibración y lista dinámica de normas aplicadas.
8. **Vista Previa** — Resumen visual (check list interactivo) que verifica precondiciones y permite la renderización final hacia PDF.

## Estructura del Informe PDF

El PDF generado sigue el formato oficial LEPS y utiliza paginación dinámica para que ningún contenido sea cortado:

| Sección                    | Contenido                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| Portada                    | Título, datos de laboratorio, módulo, cliente, firmas (Realizó / Revisó / Aprobó)           |
| Ítem de Ensayo             | Descripción completa del módulo bajo prueba (fabricante, serial, área, material de celdas)  |
| Registro Fotográfico       | 5 fotografías del ítem (frontal, trasera, conexiones, cables, etiqueta) + observaciones     |
| Procedimiento del Ensayo   | Texto del procedimiento aplicado (página independiente)                                     |
| Condiciones                | Condiciones ambientales, de medición e incertidumbre                                        |
| Resultados + Curva I-V/P-V | Tabla de resultados STC con incertidumbre + gráfica de curva promedio I-V y P-V             |
| Información Adicional      | Comparación valores nominales vs medición + desviación + gráfica de curvas I-V individuales |
| Equipo de Medición         | Tabla de equipos con serial, trazabilidad y fecha de calibración                            |
| Referencias Normativas     | Lista de normas aplicadas (IEC 60904, etc.) + marcador de fin del informe                   |

Cada página incluye header institucional (logos SENA/LEPS + tabla de versión/código/vigencia + numeración "Página X de Y") y footer (dirección + URLs + franja verde SENA).

## Licencia y Derechos de Autor

Uso institucional — Servicio Nacional de Aprendizaje (SENA), Centro de Electricidad, Electrónica y Telecomunicaciones CEET Regional Distrito Capital.
Todos los derechos reservados.
