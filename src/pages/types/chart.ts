export type ChartType = "line" | "pie" | "area";
         
export interface ChartConfig {
  x: string;                       
  y: string | string[];            
  possible_charts: ChartType[];    
  data: any[];                    
}