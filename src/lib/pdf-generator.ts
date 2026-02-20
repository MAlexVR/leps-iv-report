import jsPDF from "jspdf";
import { renderAllCurvesChart, renderAverageCurveChart } from "./pdf-charts";
import { formatDate } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StoreState = any;

// ═══════════════════════════════════════════════════════════
//  PAGE CONSTANTS  — Carta (Letter) 8.5 × 11 in
// ═══════════════════════════════════════════════════════════
const PAGE_W = 215.9;
const PAGE_H = 279.4;
const MARGIN = 17.78; // 0.7 in
const CONTENT_W = PAGE_W - 2 * MARGIN;
const HEADER_END = 42; // y where usable content starts (after header)
const FOOTER_ZONE = PAGE_H - 19; // y limit before footer (tighter to green bar)

// Colores institucionales SENA/LEPS
const COLORS = {
  senaGreen: [57, 169, 0] as [number, number, number],
  lepsYellow: [253, 195, 0] as [number, number, number],
  lepsNavy: [0, 48, 77] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  gray: [128, 128, 128] as [number, number, number],
  grayLight: [245, 245, 245] as [number, number, number],
  black: [0, 0, 0] as [number, number, number],
};

let logoSenaData: string | null = null;
let logoLepsData: string | null = null;

// ═══════════════════════════════════════════════════════════
//  IMAGE LOADER
// ═══════════════════════════════════════════════════════════
async function loadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });
}

async function ensureLogos() {
  if (!logoSenaData) logoSenaData = await loadImage("/logo-sena.png");
  if (!logoLepsData) logoLepsData = await loadImage("/logo-leps.png");
}

// ═══════════════════════════════════════════════════════════
//  HELPERS: setColor / setFill / setDraw / drawLine
// ═══════════════════════════════════════════════════════════
function setColor(doc: jsPDF, c: [number, number, number]) {
  doc.setTextColor(c[0], c[1], c[2]);
}
function setFill(doc: jsPDF, c: [number, number, number]) {
  doc.setFillColor(c[0], c[1], c[2]);
}
function setDraw(doc: jsPDF, c: [number, number, number]) {
  doc.setDrawColor(c[0], c[1], c[2]);
}
function drawLine(doc: jsPDF, yPos: number, thickness = 0.5) {
  setDraw(doc, COLORS.black);
  doc.setLineWidth(thickness * 0.352778);
  doc.line(MARGIN, yPos, PAGE_W - MARGIN, yPos);
}

// ═══════════════════════════════════════════════════════════
//  HEADER  (como leps.cls fancyhead)
// ═══════════════════════════════════════════════════════════
function addHeader(
  doc: jsPDF,
  reportDate: string,
  reportCode: string,
  reportVersion: string,
  vigenciaDate: string,
): number {
  const y = 25.4;

  // Left: SENA logo 51 %
  const senaW = CONTENT_W * 0.51;
  if (logoSenaData) doc.addImage(logoSenaData, "PNG", MARGIN, y - 8, senaW, 15);

  // Center: LEPS logo 20 %
  const lepsW = CONTENT_W * 0.2;
  const lepsX = MARGIN + senaW + 5;
  if (logoLepsData) doc.addImage(logoLepsData, "PNG", lepsX, y - 8, lepsW, 15);

  // Right: Version box 24 %
  const bx = PAGE_W - MARGIN - 42;
  const by = y - 8;
  const bw = 42;
  const rh = 5;

  setDraw(doc, COLORS.black);
  doc.setLineWidth(0.2);
  doc.setFontSize(8);
  setColor(doc, COLORS.black);
  doc.setFont("helvetica", "normal");

  doc.rect(bx, by, bw, rh);
  doc.text(`Versión ${reportVersion}`, bx + bw / 2, by + 3.5, {
    align: "center",
  });

  doc.rect(bx, by + rh, bw, rh);
  doc.text(`Código: ${reportCode}`, bx + bw / 2, by + rh + 3.5, {
    align: "center",
  });

  doc.rect(bx, by + rh * 2, bw, rh);
  doc.text(
    `Fecha de Vigencia: ${formatDate(vigenciaDate)}`,
    bx + bw / 2,
    by + rh * 2 + 3.5,
    { align: "center" },
  );

  // Page line (page numbers stamped later for accuracy)
  let currY = y + 12;
  doc.setFontSize(9);
  // placeholder — real page numbers patched at the end
  doc.text(
    `Página {p} de {t} del informe de ensayos de fecha ${formatDate(reportDate)}`,
    MARGIN,
    currY,
  );

  currY += 2;
  drawLine(doc, currY, 0.5);

  return currY + 8;
}

// ═══════════════════════════════════════════════════════════
//  FOOTER  (como leps.cls fancyfoot)
// ═══════════════════════════════════════════════════════════
function addFooter(doc: jsPDF) {
  const y = PAGE_H - 16; // closer to the green bar — less whitespace

  setDraw(doc, COLORS.black);
  doc.setLineWidth(0.5 * 0.352778);
  doc.line(MARGIN, y - 3, PAGE_W - MARGIN, y - 3);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  setColor(doc, COLORS.black);

  doc.text("Laboratorio de Ensayos para Paneles Solares (LEPS)", MARGIN, y);
  doc.text("Av. Cra 30 No. 17-91 Sur, Bogotá - Colombia", MARGIN, y + 4);

  doc.text(
    "https://electricidadelectronicaytelecomu.blogspot.com",
    PAGE_W - MARGIN,
    y,
    { align: "right" },
  );
  doc.text("www.gics-sennova.edu.co", PAGE_W - MARGIN, y + 4, {
    align: "right",
  });

  // Green institutional bar
  setFill(doc, COLORS.senaGreen);
  doc.rect(0, PAGE_H - 5, PAGE_W, 5, "F");
}

// ═══════════════════════════════════════════════════════════
//  SECTION / BODY helpers
// ═══════════════════════════════════════════════════════════
function sectionTitle(doc: jsPDF, y: number, text: string): number {
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  setColor(doc, COLORS.black);
  doc.text(text, MARGIN, y);
  return y + 8;
}

function bodyText(
  doc: jsPDF,
  y: number,
  text: string,
  maxWidth?: number,
): number {
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50);
  const lines = doc.splitTextToSize(text, maxWidth || CONTENT_W);
  doc.text(lines, MARGIN, y);
  return y + lines.length * 4.5;
}

// ═══════════════════════════════════════════════════════════
//  DYNAMIC PAGE BREAK
// ═══════════════════════════════════════════════════════════
interface PageCtx {
  doc: jsPDF;
  y: number;
  reportDate: string;
  reportCode: string;
  reportVersion: string;
  vigenciaDate: string;
}

/** If the next `needed` mm would overflow into the footer zone,
 *  close this page and start a new one. Returns the new y. */
function checkPage(ctx: PageCtx, needed: number): number {
  if (ctx.y + needed > FOOTER_ZONE) {
    addFooter(ctx.doc);
    ctx.doc.addPage();
    ctx.y = addHeader(
      ctx.doc,
      ctx.reportDate,
      ctx.reportCode,
      ctx.reportVersion,
      ctx.vigenciaDate,
    );
  }
  return ctx.y;
}

// ═══════════════════════════════════════════════════════════
//  MAIN GENERATOR
// ═══════════════════════════════════════════════════════════
export async function generatePDF(store: StoreState) {
  await ensureLogos();

  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const {
    moduleInfo,
    clientInfo,
    reportCode,
    reportVersion,
    reportDate,
    vigenciaDate,
    ambientConditions,
    measurementConditions,
    measurementResults,
    nominalValues,
    daqResults,
    equipment,
    references,
    testItemPhotos,
    procedimientoEnsayo,
    incertidumbreMedicion,
    performer,
    reviewer,
    approver,
  } = store;

  const ctx: PageCtx = {
    doc,
    y: 0,
    reportDate,
    reportCode,
    reportVersion,
    vigenciaDate,
  };

  // ========================================================================
  //  PAGE 1 — TITLE / CLIENT / SIGNATURES
  // ========================================================================
  ctx.y = addHeader(doc, reportDate, reportCode, reportVersion, vigenciaDate);

  // Title
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  setColor(doc, COLORS.black);
  doc.text("Informe de ensayos estacionarios de curva I-V", MARGIN, ctx.y);
  ctx.y += 8;
  doc.setFontSize(16);
  doc.text("Determinación del punto de máxima potencia (MPP)", MARGIN, ctx.y);
  ctx.y += 10;

  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  setColor(doc, COLORS.gray);
  doc.text("Expedido por el laboratorio de ensayos", MARGIN, ctx.y);
  ctx.y += 6;

  doc.setFont("helvetica", "bold");
  setColor(doc, COLORS.black);
  doc.setFontSize(12);
  doc.text("Laboratorio de Ensayos para Paneles Solares (LEPS)", MARGIN, ctx.y);
  ctx.y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const labInfo = [
    "Servicio Nacional de Aprendizaje SENA",
    "Centro de Electricidad, Electrónica y Telecomunicaciones",
    "Regional Distrito Capital",
    "Sede Complejo Sur: Localidad Antonio Nariño, Av. Cra 30 No. 17-91 Sur",
    "Bogotá - Colombia",
  ];
  labInfo.forEach((line) => {
    doc.text(line, MARGIN, ctx.y);
    ctx.y += 4;
  });
  ctx.y += 2;
  drawLine(doc, ctx.y, 0.4);
  ctx.y += 6;

  // Module / Client info rows
  const infoRows = [
    ["Objeto", moduleInfo.objeto],
    ["Fabricante", moduleInfo.fabricante],
    ["Referencia", moduleInfo.referencia],
    ["Número serial", moduleInfo.serial],
    [
      "Cliente",
      `${clientInfo.company}\n${clientInfo.contacto}\n${clientInfo.codigoPostal}\n${clientInfo.direccion}\n${clientInfo.pais}`,
    ],
    ["No. de orden", clientInfo.noOrden],
    ["Fecha del informe", formatDate(reportDate)],
  ];

  doc.setFontSize(10);
  for (const [label, value] of infoRows) {
    if (label) {
      doc.setFont("helvetica", "normal");
      setColor(doc, COLORS.black);
      doc.text(label, MARGIN, ctx.y);
      doc.setFont("helvetica", "bold");
      const vLines = doc.splitTextToSize(value || "", 100);
      doc.text(vLines, MARGIN + 40, ctx.y);
      ctx.y += Math.max(vLines.length * 5, 5);
    }
  }

  ctx.y += 2;
  setDraw(doc, COLORS.senaGreen);
  doc.line(MARGIN, ctx.y, PAGE_W - MARGIN, ctx.y);
  ctx.y += 6;

  // Disclaimer
  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100);
  const disclaimer =
    "Este informe de ensayo sólo puede distribuirse íntegro y sin modificaciones. Los extractos o modificaciones requieren la autorización del laboratorio de ensayos emisor. Los informes de ensayos sin firma no son válidos. Los resultados de los ensayos se refieren exclusivamente al elemento proporcionado por el cliente.";
  const dLines = doc.splitTextToSize(disclaimer, CONTENT_W);
  doc.text(dLines, MARGIN, ctx.y);
  ctx.y += dLines.length * 3.5 + 8;

  // Signatures (no date — already shown in header)
  setDraw(doc, COLORS.senaGreen);
  doc.line(MARGIN, ctx.y, PAGE_W - MARGIN, ctx.y);
  ctx.y += 5;

  doc.setFontSize(8);
  const sigW = CONTENT_W / 3;
  const sigLabels = ["Realizó:", "Revisó:", "Aprobó:"];
  const sigRoles = [performer.role, reviewer.role, approver.role];
  const sigNames = [performer.name, reviewer.name, approver.name];
  const sigImages = [
    performer.signatureImage,
    reviewer.signatureImage,
    approver.signatureImage,
  ];

  doc.setFont("helvetica", "normal");
  doc.setTextColor(80);
  for (let i = 0; i < 3; i++) {
    doc.text(sigLabels[i], MARGIN + i * sigW, ctx.y);
  }
  ctx.y += 4;
  for (let i = 0; i < 3; i++) {
    doc.setFontSize(6.5);
    const roleLines = doc.splitTextToSize(sigRoles[i] || "", sigW - 5);
    doc.text(roleLines, MARGIN + i * sigW, ctx.y);
  }
  ctx.y += 8;

  // Signature images
  for (let i = 0; i < 3; i++) {
    if (sigImages[i]) {
      try {
        doc.addImage(
          sigImages[i]!,
          "PNG",
          MARGIN + i * sigW,
          ctx.y - 6,
          30,
          12,
        );
      } catch {
        /* skip */
      }
    }
  }
  ctx.y += 14;

  // Names — wrap within column width to prevent overlap
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(80);
  for (let i = 0; i < 3; i++) {
    const nameText = sigNames[i] || "Nombre del " + sigRoles[i];
    const nameLines = doc.splitTextToSize(nameText, sigW - 5);
    doc.text(nameLines, MARGIN + i * sigW, ctx.y);
  }

  addFooter(doc);

  // ========================================================================
  //  PAGE 2 — ÍTEM DE ENSAYO + REGISTRO FOTOGRÁFICO
  // ========================================================================
  doc.addPage();
  ctx.y = addHeader(doc, reportDate, reportCode, reportVersion, vigenciaDate);

  ctx.y = sectionTitle(doc, ctx.y, "Ítem de ensayo");
  const itemRows = [
    ["Objeto", moduleInfo.objeto],
    ["Fabricante", moduleInfo.fabricante],
    ["Referencia", moduleInfo.referencia],
    ["Material de las celdas", moduleInfo.materialCeldas],
    ["Número serial", moduleInfo.serial],
    ["Área del módulo", moduleInfo.areaModulo],
    ["Observaciones", moduleInfo.observaciones],
  ];
  doc.setFontSize(9);
  for (const [label, value] of itemRows) {
    ctx.y = checkPage(ctx, 8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);
    doc.text(label, MARGIN, ctx.y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30);
    const vLines = doc.splitTextToSize(value || "", CONTENT_W - 55);
    doc.text(vLines, MARGIN + 50, ctx.y);
    ctx.y += Math.max(vLines.length * 4.5, 6);
  }
  ctx.y += 6;

  // ── Photos right after Ítem de ensayo ──
  ctx.y = checkPage(ctx, 20);
  ctx.y = sectionTitle(doc, ctx.y, "Registro Fotográfico del Ítem de Ensayo");

  const pW = (CONTENT_W - 10) / 2;
  const pH = pW * 0.75;
  let pX = MARGIN;
  let pY = ctx.y + 5;

  const renderPhoto = (imgData: string | null, label: string) => {
    if (imgData) {
      try {
        doc.addImage(imgData, "PNG", pX, pY, pW, pH);
      } catch {
        // skip bad images
      }
    } else {
      doc.setDrawColor(220, 220, 220);
      doc.setFillColor(245, 245, 245);
      doc.rect(pX, pY, pW, pH, "FD");
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("Sin imagen", pX + pW / 2, pY + pH / 2, { align: "center" });
    }
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(label, pX + pW / 2, pY + pH + 5, { align: "center" });
  };

  // Check if photos need a new page
  if (pY + pH + 15 > FOOTER_ZONE) {
    addFooter(doc);
    doc.addPage();
    ctx.y = addHeader(doc, reportDate, reportCode, reportVersion, vigenciaDate);
    pY = ctx.y + 5;
  }

  // Row 1
  renderPhoto(testItemPhotos.frontal, "Vista Frontal");
  pX += pW + 10;
  renderPhoto(testItemPhotos.trasera, "Vista Trasera");

  // Row 2
  pX = MARGIN;
  pY += pH + 12;
  if (pY + pH + 15 > FOOTER_ZONE) {
    addFooter(doc);
    doc.addPage();
    ctx.y = addHeader(doc, reportDate, reportCode, reportVersion, vigenciaDate);
    pY = ctx.y + 5;
  }
  renderPhoto(testItemPhotos.cajaConexiones, "Caja de Conexiones");
  pX += pW + 10;
  renderPhoto(testItemPhotos.cablesConectores, "Cables y Conectores");

  // Row 3
  pX = MARGIN + (pW + 10) / 2;
  pY += pH + 12;
  if (pY + pH + 15 > FOOTER_ZONE) {
    addFooter(doc);
    doc.addPage();
    ctx.y = addHeader(doc, reportDate, reportCode, reportVersion, vigenciaDate);
    pY = ctx.y + 5;
    pX = MARGIN + (pW + 10) / 2;
  }
  renderPhoto(testItemPhotos.etiqueta, "Etiqueta");

  // Observations from Step 2
  ctx.y = pY + pH + 15;
  if (moduleInfo.observaciones && moduleInfo.observaciones.trim()) {
    ctx.y = checkPage(ctx, 20);
    ctx.y = sectionTitle(doc, ctx.y, "Observaciones");
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50);
    const obsLines = doc.splitTextToSize(moduleInfo.observaciones, CONTENT_W);
    for (const line of obsLines) {
      ctx.y = checkPage(ctx, 5);
      doc.text(line, MARGIN, ctx.y);
      ctx.y += 4.5;
    }
  }

  addFooter(doc);

  // ========================================================================
  //  PAGE: PROCEDIMIENTO DEL ENSAYO (independent page)
  // ========================================================================
  doc.addPage();
  ctx.y = addHeader(doc, reportDate, reportCode, reportVersion, vigenciaDate);

  ctx.y = sectionTitle(doc, ctx.y, "Procedimiento del ensayo");

  // Render procedure with dynamic page breaks
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50);
  const procLines = doc.splitTextToSize(procedimientoEnsayo || "", CONTENT_W);
  for (const line of procLines) {
    ctx.y = checkPage(ctx, 5);
    doc.text(line, MARGIN, ctx.y);
    ctx.y += 4.5;
  }

  addFooter(doc);

  // ========================================================================
  //  PAGE: CONDITIONS + UNCERTAINTY
  // ========================================================================
  doc.addPage();
  ctx.y = addHeader(doc, reportDate, reportCode, reportVersion, vigenciaDate);

  ctx.y = sectionTitle(doc, ctx.y, "Condiciones ambientales");
  ctx.y = bodyText(
    doc,
    ctx.y,
    "El ensayo se llevó a cabo en las instalaciones del Laboratorio de Ensayos para Paneles Solares (LEPS).",
  );
  ctx.y += 2;

  const ambRows = [
    ["Temperatura", ambientConditions.temperatura],
    ["Humedad Relativa", ambientConditions.humedadRelativa],
  ];
  for (const [l, v] of ambRows) {
    ctx.y = checkPage(ctx, 8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);
    doc.setFontSize(9);
    doc.text(l, MARGIN, ctx.y);
    doc.text(v || "", MARGIN + 50, ctx.y);
    ctx.y += 6;
  }
  ctx.y += 6;

  ctx.y = checkPage(ctx, 20);
  ctx.y = sectionTitle(doc, ctx.y, "Condiciones de medición");
  const condRows = [
    ["Irradiancia total", measurementConditions.irradianciaTotal],
    ["Temperatura del módulo", measurementConditions.temperaturaModulo],
    ["Sistema de medición", measurementConditions.sistemaMedicion],
    [
      "Corrección del desajuste espectral",
      measurementConditions.correccionDesajuste,
    ],
    ["Hysteresis", measurementConditions.hysteresis],
    ["Número de secciones", measurementConditions.numeroSecciones],
    ["Duración de la medición", measurementConditions.duracionMedicion],
    ["Comentarios", measurementConditions.comentarios],
  ];
  for (const [l, v] of condRows) {
    ctx.y = checkPage(ctx, 8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);
    doc.setFontSize(9);
    doc.text(l, MARGIN, ctx.y);
    const vLines = doc.splitTextToSize(v || "", 100);
    doc.text(vLines, MARGIN + 60, ctx.y);
    ctx.y += Math.max(vLines.length * 4.5, 6);
  }
  ctx.y += 6;

  // Uncertainty
  ctx.y = checkPage(ctx, 20);
  ctx.y = sectionTitle(doc, ctx.y, "Incertidumbre en la medición");
  // render with page-break-aware line splitting
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50);
  const uncLines = doc.splitTextToSize(incertidumbreMedicion || "", CONTENT_W);
  for (const line of uncLines) {
    ctx.y = checkPage(ctx, 5);
    doc.text(line, MARGIN, ctx.y);
    ctx.y += 4.5;
  }

  addFooter(doc);

  // ========================================================================
  //  PAGE: RESULTS + CHARTS
  // ========================================================================
  doc.addPage();
  ctx.y = addHeader(doc, reportDate, reportCode, reportVersion, vigenciaDate);

  ctx.y = sectionTitle(doc, ctx.y, "Resultados de las mediciones");
  ctx.y = bodyText(
    doc,
    ctx.y,
    "Los resultados de las mediciones se corrigieron a las condiciones de ensayo estándar (STC):\nDistribución de irradiancia espectral: AM1.5G [1], Irradiancia total: 1000 W/m², Temperatura: 25 °C.",
  );
  ctx.y += 2;

  // Results table
  const resultsRows = [
    ["Corriente de cortocircuito", "Isc / A", measurementResults.isc],
    ["Voltaje de circuito abierto", "Voc / V", measurementResults.voc],
    ["Corriente a la potencia máxima", "Impp / A", measurementResults.impp],
    ["Voltaje a la potencia máxima", "Vmpp / V", measurementResults.vmpp],
    ["Potencia máxima *", "Pmpp / W", measurementResults.pmpp],
    ["Factor de llenado *", "FF / %", measurementResults.ff],
    ["Eficiencia *", "η / %", measurementResults.efficiency],
  ];

  const colWidths = [65, 40, 30, 10, 30];
  const rowH = 7;

  setDraw(doc, COLORS.black);
  doc.setLineWidth(0.3 * 0.352778);
  doc.line(MARGIN, ctx.y, MARGIN + CONTENT_W, ctx.y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setColor(doc, COLORS.black);
  ctx.y += 5;
  doc.text("Mesurando", MARGIN + 2, ctx.y);
  doc.text("Símbolo", MARGIN + colWidths[0], ctx.y);
  doc.text("Valor", MARGIN + colWidths[0] + colWidths[1], ctx.y, {
    align: "center",
  });
  doc.text("±", MARGIN + colWidths[0] + colWidths[1] + colWidths[2], ctx.y, {
    align: "center",
  });
  doc.text(
    "Uncert.",
    MARGIN + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 5,
    ctx.y,
  );
  ctx.y += 2;
  doc.line(MARGIN, ctx.y, MARGIN + CONTENT_W, ctx.y);
  ctx.y += 5;

  for (const [label, sym, data] of resultsRows) {
    doc.setFont("helvetica", "normal");
    doc.text(label as string, MARGIN + 2, ctx.y);
    doc.setFont("helvetica", "italic");
    doc.text(sym as string, MARGIN + colWidths[0], ctx.y);
    doc.setFont("helvetica", "bold");
    const d = data as { value: number; uncertainty: number };
    doc.text(String(d.value), MARGIN + colWidths[0] + colWidths[1], ctx.y, {
      align: "center",
    });
    doc.setFont("helvetica", "normal");
    doc.text("±", MARGIN + colWidths[0] + colWidths[1] + colWidths[2], ctx.y, {
      align: "center",
    });
    doc.text(
      String(d.uncertainty),
      MARGIN + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 5,
      ctx.y,
    );
    ctx.y += rowH;
  }

  doc.line(MARGIN, ctx.y - 2, MARGIN + CONTENT_W, ctx.y - 2);
  ctx.y += 2;
  doc.setFontSize(8);
  setColor(doc, COLORS.gray);
  doc.text("* Valor derivado", MARGIN, ctx.y);
  ctx.y += 8;

  // Average I-V and P-V chart
  if (daqResults) {
    const chartH = (CONTENT_W - 10) * 0.56;
    ctx.y = checkPage(ctx, chartH + 10);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50);
    doc.text("Curva I-V y P-V promedio", MARGIN, ctx.y);
    ctx.y += 4;

    const avgChartImg = renderAverageCurveChart(
      daqResults.averageCurve,
      daqResults.graphicResults,
    );
    doc.addImage(avgChartImg, "PNG", MARGIN + 5, ctx.y, CONTENT_W - 10, chartH);
    ctx.y += chartH + 4;
  }

  addFooter(doc);

  // ========================================================================
  //  PAGE: ADDITIONAL INFO + EQUIPMENT + REFERENCES
  // ========================================================================
  doc.addPage();
  ctx.y = addHeader(doc, reportDate, reportCode, reportVersion, vigenciaDate);

  ctx.y = sectionTitle(doc, ctx.y, "Información adicional");

  // Deviation helper
  const deviation = (m: number, n: number) =>
    n === 0 ? "—" : `${(((m - n) / n) * 100).toFixed(1)} %`;

  const compHeaders = [
    "",
    "Isc/A",
    "Voc/V",
    "Impp/A",
    "Vmpp/V",
    "Pmpp/W",
    "FF/%",
    "η/%",
  ];
  const mVals = [
    measurementResults.isc.value,
    measurementResults.voc.value,
    measurementResults.impp.value,
    measurementResults.vmpp.value,
    measurementResults.pmpp.value,
    measurementResults.ff.value,
    measurementResults.efficiency.value,
  ];
  const nVals = [
    nominalValues.isc,
    nominalValues.voc,
    nominalValues.impp,
    nominalValues.vmpp,
    nominalValues.pmpp,
    nominalValues.ff,
    nominalValues.efficiency,
  ];

  // Header row
  setDraw(doc, [180, 180, 180]);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, ctx.y, PAGE_W - MARGIN, ctx.y);
  ctx.y += 4;
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(50);
  const colW = CONTENT_W / 8;
  compHeaders.forEach((h, i) =>
    doc.text(h, MARGIN + i * colW + colW / 2, ctx.y, { align: "center" }),
  );
  ctx.y += 2;
  doc.line(MARGIN, ctx.y, PAGE_W - MARGIN, ctx.y);

  // Nominal row
  ctx.y += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Valores nominales", MARGIN + colW / 2, ctx.y, { align: "center" });
  nVals.forEach((v, i) =>
    doc.text(String(v || "—"), MARGIN + (i + 1) * colW + colW / 2, ctx.y, {
      align: "center",
    }),
  );

  // Measured row
  ctx.y += 5;
  doc.text("Resultado medición", MARGIN + colW / 2, ctx.y, { align: "center" });
  mVals.forEach((v, i) =>
    doc.text(String(v || "—"), MARGIN + (i + 1) * colW + colW / 2, ctx.y, {
      align: "center",
    }),
  );
  ctx.y += 2;
  doc.line(MARGIN, ctx.y, PAGE_W - MARGIN, ctx.y);

  // Deviation row
  ctx.y += 4;
  doc.setFont("helvetica", "italic");
  doc.text("Desviación", MARGIN + colW / 2, ctx.y, { align: "center" });
  mVals.forEach((m, i) =>
    doc.text(
      deviation(m, nVals[i]),
      MARGIN + (i + 1) * colW + colW / 2,
      ctx.y,
      { align: "center" },
    ),
  );
  ctx.y += 2;
  doc.line(MARGIN, ctx.y, PAGE_W - MARGIN, ctx.y);
  ctx.y += 8;

  // All curves chart
  if (daqResults && daqResults.individualCurves.length > 0) {
    const chartH = (CONTENT_W - 10) * 0.56;
    ctx.y = checkPage(ctx, chartH + 10);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50);
    doc.text("Curvas I-V individuales (repetibilidad)", MARGIN, ctx.y);
    ctx.y += 4;

    const allCurvesImg = renderAllCurvesChart(daqResults.individualCurves);
    doc.addImage(
      allCurvesImg,
      "PNG",
      MARGIN + 5,
      ctx.y,
      CONTENT_W - 10,
      chartH,
    );
    ctx.y += chartH + 8;
  }

  // Equipment
  ctx.y = checkPage(ctx, 30);
  ctx.y = sectionTitle(doc, ctx.y, "Equipo de medición");
  setDraw(doc, [180, 180, 180]);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, ctx.y, PAGE_W - MARGIN, ctx.y);
  ctx.y += 4;

  const eqHeaders = [
    "Descripción",
    "Número serial",
    "Trazabilidad",
    "Fecha cal.",
  ];
  const eqColW = [55, 40, 45, 25];
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(50);
  let ex = MARGIN;
  eqHeaders.forEach((h, i) => {
    doc.text(h, ex, ctx.y);
    ex += eqColW[i];
  });
  ctx.y += 2;
  doc.line(MARGIN, ctx.y, PAGE_W - MARGIN, ctx.y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(60);
  for (const eq of equipment) {
    ctx.y = checkPage(ctx, 12);
    ctx.y += 5;
    ex = MARGIN;
    doc.text(eq.descripcion, ex, ctx.y);
    doc.setFontSize(5.5);
    doc.setTextColor(130);
    doc.text(eq.modelo, ex, ctx.y + 3);
    doc.setFontSize(7);
    doc.setTextColor(60);
    ex += eqColW[0];
    doc.text(eq.serial, ex, ctx.y);
    ex += eqColW[1];
    doc.text(eq.trazabilidad, ex, ctx.y);
    ex += eqColW[2];
    doc.text(eq.fechaCalibracion, ex, ctx.y);
    ctx.y += 3;
  }
  ctx.y += 4;
  doc.line(MARGIN, ctx.y, PAGE_W - MARGIN, ctx.y);
  ctx.y += 6;

  // References
  ctx.y = checkPage(ctx, 20);
  ctx.y = sectionTitle(doc, ctx.y, "Referencias normativas");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50);
  for (const ref of references) {
    ctx.y = checkPage(ctx, 12);
    doc.setFont("helvetica", "bold");
    doc.text(`[${ref.id}] ${ref.code}:`, MARGIN, ctx.y);
    ctx.y += 4;
    doc.setFont("helvetica", "normal");
    const refLines = doc.splitTextToSize(ref.title, CONTENT_W - 5);
    doc.text(refLines, MARGIN + 5, ctx.y);
    ctx.y += refLines.length * 3.5 + 2;
  }

  // End of report marker (after references — final content)
  ctx.y += 6;
  ctx.y = checkPage(ctx, 15);
  setDraw(doc, COLORS.senaGreen);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, ctx.y, PAGE_W - MARGIN, ctx.y);
  ctx.y += 6;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  setColor(doc, COLORS.gray);
  doc.text("— Fin del informe de ensayo —", PAGE_W / 2, ctx.y, {
    align: "center",
  });

  addFooter(doc);

  // ========================================================================
  //  POST-PROCESS: stamp correct page numbers on every page
  // ========================================================================
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    // Find and overwrite the placeholder text
    // jsPDF doesn't support text replacement, so we draw a white rect over the
    // placeholder area and re-render the correct text.
    const lineY = 25.4 + 12; // same y as in addHeader
    setFill(doc, COLORS.white);
    doc.rect(MARGIN, lineY - 4, CONTENT_W * 0.65, 5, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    setColor(doc, COLORS.black);
    doc.text(
      `Página ${p} de ${totalPages} del informe de ensayos de fecha ${formatDate(reportDate)}`,
      MARGIN,
      lineY,
    );
  }

  // Save
  const filename = `LEPS_Informe_IV_${moduleInfo.referencia || "modulo"}_${formatDate(reportDate).replace(/\//g, "-")}.pdf`;
  doc.save(filename);
}
