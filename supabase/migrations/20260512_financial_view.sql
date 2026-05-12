-- Financial Summary View
CREATE OR REPLACE VIEW financial_summary AS
WITH operation_costs AS (
  SELECT 
    f.crop_season_id,
    SUM(oi.quantity_used * oi.cost_at_time) as total_input_costs
  FROM field_operations f
  JOIN operation_inputs oi ON f.id = oi.operation_id
  GROUP BY f.crop_season_id
),
maintenance_costs AS (
  SELECT 
    crop_season_id,
    SUM(cost) as total_maintenance
  FROM machinery_maintenance
  GROUP BY crop_season_id
),
fuel_costs AS (
  SELECT 
    f.crop_season_id,
    SUM(l.fuel_cost) as total_fuel
  FROM field_operations f
  JOIN machinery_logs l ON f.id = l.operation_id
  GROUP BY f.crop_season_id
),
revenues AS (
  SELECT 
    crop_season_id,
    SUM(total_value) as total_revenue
  FROM sales_contracts
  GROUP BY crop_season_id
)
SELECT 
  cs.id as crop_season_id,
  cs.name as season_name,
  COALESCE(oc.total_input_costs, 0) + COALESCE(mc.total_maintenance, 0) + COALESCE(fc.total_fuel, 0) as total_costs,
  COALESCE(r.total_revenue, 0) as total_revenue,
  COALESCE(r.total_revenue, 0) - (COALESCE(oc.total_input_costs, 0) + COALESCE(mc.total_maintenance, 0) + COALESCE(fc.total_fuel, 0)) as profit
FROM crop_seasons cs
LEFT JOIN operation_costs oc ON cs.id = oc.crop_season_id
LEFT JOIN maintenance_costs mc ON cs.id = mc.crop_season_id
LEFT JOIN fuel_costs fc ON cs.id = fc.crop_season_id
LEFT JOIN revenues r ON cs.id = r.crop_season_id;
