export class MonthlyCashFlowDto {
  year: number;
  month: number;
  in: number;
  out: number;
}

export class CashFlowReportDto {
  monthlyData: MonthlyCashFlowDto[];
}
