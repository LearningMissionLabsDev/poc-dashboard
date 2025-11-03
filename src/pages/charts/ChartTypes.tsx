import type { ChartConfig } from "../types/chart";
import NeonAreaChartApex from "./renderers/AreaChartRenderer";
import NeonPieChartApex from "./renderers/DonutRenderer";
import NeonLineChartApex from "./renderers/LineChartRenderer";

function ensureConfig(config: ChartConfig): ChartConfig {
  if (Array.isArray(config?.data) && config.data.length > 0) return config;

  return config;
}

type RenderOpts = { onClose?: () => void };

export function renderChart(type: string, config: ChartConfig, opts: RenderOpts = {}) {
  const cfg = ensureConfig(config);
  const onClose = opts.onClose ?? (() => { });
  const handleClose = () => {
    onClose();
  };

 switch (type) {
  case "line":
    return <NeonLineChartApex config={cfg} onClose={handleClose} />;

  case "pie":
    return <NeonPieChartApex config={cfg} onClose={handleClose} />;

  case "area":
    return <NeonAreaChartApex config={cfg} onClose={handleClose} />;

  default:
    return <div>Chart type {type} not implemented</div>;
}
}

export default { renderChart };