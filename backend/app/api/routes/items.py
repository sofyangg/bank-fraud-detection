from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select, text
from sqlalchemy import  distinct, case
from app.api.deps import  SessionDep 
from app.models import KPISummary,Transaction ,Message

router = APIRouter(prefix="/dashboard_kpis", tags=["kpis"])
@router.get("/",response_model=KPISummary)
def read_kpis(
    session: SessionDep
) -> Any:
    try:
        query = text("""
    WITH RankedTransactions AS (
        SELECT 
            "Transaction_Amount",
            "Fraud_Label",
            "Fraud_Probability",
            PERCENT_RANK() OVER (ORDER BY "Fraud_Probability" DESC) as risk_percentile
        FROM "Transaction"
    )
    SELECT 
        COUNT(*) as total_transaction_count,
        SUM("Transaction_Amount") as aggregate_monetary_value,
        SUM(CASE WHEN "Fraud_Label" = 1 THEN 1 ELSE 0 END) as number_of_suspicious_records,
        SUM(CASE WHEN "Fraud_Label" = 1 THEN "Transaction_Amount" ELSE 0 END) as total_fraud_value,
        AVG("Fraud_Probability") FILTER (WHERE risk_percentile <= 0.1) as average_top_decile_risk
    FROM RankedTransactions
""")
        
        
        KPIS = session.exec(query).one()
        if not KPIS:
            raise HTTPException(status_code=404, detail="No data found")
        return KPISummary(total_transactions=int(KPIS[0]), total_exposure_amount=float(KPIS[1])
        ,total_fraud_count=int(KPIS[2]),total_fraud_value=float(KPIS[3])
        ,avg_top_decile_risk=float(KPIS[4]))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database aggregation failed: {str(e)}")



