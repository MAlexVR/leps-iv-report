import { IVDataPoint } from '@/types/report';

const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed', '#db2777', '#0891b2', '#65a30d', '#ea580c', '#6366f1'];

interface ChartConfig {
  width: number;
  height: number;
  padding: { top: number; right: number; bottom: number; left: number };
}

const DEFAULT_CONFIG: ChartConfig = {
  width: 800,
  height: 450,
  padding: { top: 40, right: 80, bottom: 50, left: 65 },
};

function createCanvas(config: ChartConfig): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = config.width;
  canvas.height = config.height;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, config.width, config.height);
  return { canvas, ctx };
}

function drawAxes(ctx: CanvasRenderingContext2D, config: ChartConfig, xLabel: string, yLabel: string, yLabel2?: string) {
  const { width, height, padding } = config;
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  // Grid
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 5; i++) {
    const y = padding.top + (plotH * i) / 5;
    ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(padding.left + plotW, y); ctx.stroke();
    const x = padding.left + (plotW * i) / 5;
    ctx.beginPath(); ctx.moveTo(x, padding.top); ctx.lineTo(x, padding.top + plotH); ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, padding.top + plotH);
  ctx.lineTo(padding.left + plotW, padding.top + plotH);
  ctx.stroke();

  // Labels
  ctx.fillStyle = '#374151';
  ctx.font = '11px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(xLabel, padding.left + plotW / 2, height - 8);

  ctx.save();
  ctx.translate(14, padding.top + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(yLabel, 0, 0);
  ctx.restore();

  if (yLabel2) {
    // Right y-axis
    ctx.strokeStyle = '#374151';
    ctx.beginPath();
    ctx.moveTo(padding.left + plotW, padding.top);
    ctx.lineTo(padding.left + plotW, padding.top + plotH);
    ctx.stroke();

    ctx.save();
    ctx.translate(width - 10, padding.top + plotH / 2);
    ctx.rotate(Math.PI / 2);
    ctx.fillText(yLabel2, 0, 0);
    ctx.restore();
  }
}

function drawTickLabels(ctx: CanvasRenderingContext2D, config: ChartConfig, xMax: number, yMax: number, yMax2?: number) {
  const { padding } = config;
  const plotW = config.width - padding.left - padding.right;
  const plotH = config.height - padding.top - padding.bottom;

  ctx.fillStyle = '#6b7280';
  ctx.font = '10px Inter, sans-serif';

  // X ticks
  ctx.textAlign = 'center';
  for (let i = 0; i <= 5; i++) {
    const val = (xMax * i) / 5;
    const x = padding.left + (plotW * i) / 5;
    ctx.fillText(val.toFixed(1), x, padding.top + plotH + 16);
  }

  // Y ticks (left)
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const val = (yMax * (5 - i)) / 5;
    const y = padding.top + (plotH * i) / 5;
    ctx.fillText(val.toFixed(1), padding.left - 8, y + 3);
  }

  // Y ticks (right)
  if (yMax2 !== undefined) {
    ctx.textAlign = 'left';
    for (let i = 0; i <= 5; i++) {
      const val = (yMax2 * (5 - i)) / 5;
      const y = padding.top + (plotH * i) / 5;
      ctx.fillText(val.toFixed(0), config.width - padding.right + 8, y + 3);
    }
  }
}

function plotLine(ctx: CanvasRenderingContext2D, config: ChartConfig, data: { x: number; y: number }[], xMax: number, yMax: number, color: string, lineWidth = 1.5) {
  const { padding } = config;
  const plotW = config.width - padding.left - padding.right;
  const plotH = config.height - padding.top - padding.bottom;

  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  let started = false;
  for (const pt of data) {
    const x = padding.left + (pt.x / xMax) * plotW;
    const y = padding.top + plotH - (pt.y / yMax) * plotH;
    if (!started) { ctx.moveTo(x, y); started = true; } else { ctx.lineTo(x, y); }
  }
  ctx.stroke();
}

/** Render all individual I-V curves overlaid */
export function renderAllCurvesChart(curves: { name: string; data: IVDataPoint[] }[]): string {
  const config = DEFAULT_CONFIG;
  const { canvas, ctx } = createCanvas(config);

  let xMax = 0, yMax = 0;
  for (const c of curves) {
    for (const pt of c.data) {
      if (pt.voltage > xMax) xMax = pt.voltage;
      if (pt.current > yMax) yMax = pt.current;
    }
  }
  xMax *= 1.05;
  yMax *= 1.1;

  drawAxes(ctx, config, 'Voltaje (V)', 'Corriente (A)');
  drawTickLabels(ctx, config, xMax, yMax);

  // Title
  ctx.fillStyle = '#111827';
  ctx.font = 'bold 13px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Curvas I-V individuales (Repetibilidad)', config.width / 2, 20);

  // Plot each curve
  curves.forEach((curve, idx) => {
    const data = curve.data.map(pt => ({ x: pt.voltage, y: pt.current }));
    plotLine(ctx, config, data, xMax, yMax, COLORS[idx % COLORS.length]);
  });

  // Legend
  const legendX = config.padding.left + 10;
  let legendY = config.height - config.padding.bottom - curves.length * 14 - 5;
  ctx.font = '9px Inter, sans-serif';
  curves.forEach((curve, idx) => {
    ctx.fillStyle = COLORS[idx % COLORS.length];
    ctx.fillRect(legendX, legendY - 4, 12, 3);
    ctx.fillStyle = '#6b7280';
    ctx.textAlign = 'left';
    ctx.fillText(curve.name, legendX + 16, legendY);
    legendY += 14;
  });

  return canvas.toDataURL('image/png');
}

/** Render average I-V and P-V curves with MPP marker */
export function renderAverageCurveChart(
  avgCurve: IVDataPoint[],
  graphicResults: { Vpm: number; Ipm: number; Pmax: number }
): string {
  const config = { ...DEFAULT_CONFIG, padding: { top: 40, right: 80, bottom: 50, left: 65 } };
  const { canvas, ctx } = createCanvas(config);

  let xMax = 0, yMaxI = 0, yMaxP = 0;
  for (const pt of avgCurve) {
    if (pt.voltage > xMax) xMax = pt.voltage;
    if (pt.current > yMaxI) yMaxI = pt.current;
    if (pt.power > yMaxP) yMaxP = pt.power;
  }
  xMax *= 1.05;
  yMaxI *= 1.1;
  yMaxP *= 1.15;

  drawAxes(ctx, config, 'Voltaje (V)', 'Corriente (A)', 'Potencia (W)');
  drawTickLabels(ctx, config, xMax, yMaxI, yMaxP);

  // Title
  ctx.fillStyle = '#111827';
  ctx.font = 'bold 13px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Curvas I-V y P-V promedio', config.width / 2, 20);

  // I-V curve (blue)
  const ivData = avgCurve.map(pt => ({ x: pt.voltage, y: pt.current }));
  plotLine(ctx, config, ivData, xMax, yMaxI, '#2563eb', 2);

  // P-V curve (red, using right axis)
  const { padding } = config;
  const plotW = config.width - padding.left - padding.right;
  const plotH = config.height - padding.top - padding.bottom;

  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 3]);
  ctx.beginPath();
  let started = false;
  for (const pt of avgCurve) {
    const x = padding.left + (pt.voltage / xMax) * plotW;
    const y = padding.top + plotH - (pt.power / yMaxP) * plotH;
    if (!started) { ctx.moveTo(x, y); started = true; } else { ctx.lineTo(x, y); }
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // MPP marker
  const mppX = padding.left + (graphicResults.Vpm / xMax) * plotW;
  const mppYI = padding.top + plotH - (graphicResults.Ipm / yMaxI) * plotH;
  const mppYP = padding.top + plotH - (graphicResults.Pmax / yMaxP) * plotH;

  // Dashed lines to MPP
  ctx.strokeStyle = '#9ca3af';
  ctx.lineWidth = 0.8;
  ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(mppX, padding.top + plotH); ctx.lineTo(mppX, mppYI); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(padding.left, mppYI); ctx.lineTo(mppX, mppYI); ctx.stroke();
  ctx.setLineDash([]);

  // MPP dot on P-V
  ctx.fillStyle = '#dc2626';
  ctx.beginPath(); ctx.arc(mppX, mppYP, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 10px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Pmax = ${graphicResults.Pmax.toFixed(1)} W`, mppX + 8, mppYP - 5);

  // Legend
  ctx.font = '10px Inter, sans-serif';
  const lx = padding.left + 10, ly = padding.top + plotH - 50;
  ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 20, ly); ctx.stroke();
  ctx.fillStyle = '#374151'; ctx.textAlign = 'left';
  ctx.fillText('I-V prom.', lx + 24, ly + 3);

  ctx.strokeStyle = '#dc2626'; ctx.setLineDash([5, 3]);
  ctx.beginPath(); ctx.moveTo(lx, ly + 16); ctx.lineTo(lx + 20, ly + 16); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillText('P-V prom.', lx + 24, ly + 19);

  ctx.fillStyle = '#dc2626';
  ctx.beginPath(); ctx.arc(lx + 10, ly + 32, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#374151';
  ctx.fillText('Pmax', lx + 24, ly + 35);

  return canvas.toDataURL('image/png');
}
