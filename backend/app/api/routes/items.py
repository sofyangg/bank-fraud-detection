from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select
from sqlalchemy import  distinct, case
from app.api.deps import  SessionDep 
from app.models import KPISummary,Transaction ,Message

router = APIRouter(prefix="/dashboard_kpis", tags=["kpis"])
@router.get("/",response_model=KPISummary)
def read_kpis(
    session: SessionDep
) -> Any:
    try:
        # 1. Subquery: Calculate top 10% average risk
        subq = (
            select(func.avg(Transaction.Fraud_Probability))
            .select_from(Transaction)
            .order_by(Transaction.Fraud_Probability.desc())
            .limit(
                select(func.greatest(1, func.ceil(func.count(Transaction.Transaction_ID) * 0.10)))
                .select_from(Transaction)
                .scalar_subquery()
            )
            .scalar_subquery()
        )
        # 2. Main query
        stmt = select(
            func.count(distinct(Transaction.Transaction_ID)).label("total_transactions"),
            func.coalesce(func.sum(Transaction.Transaction_Amount), 0.0).label("total_exposure_amount"),
            
            # Count for fraud cases
            func.count(
                case((Transaction.Fraud_Label == 1, 1), else_=None)
            ).label("total_fraud_count"),
            
            # Amount exposure for fraud cases 
            func.coalesce(
                func.sum(
                    case((Transaction.Fraud_Label == 1, Transaction.Transaction_Amount), else_=0.0)
                ), 
                0.0
            ).label("total_fraud_value"),
            
            # Top decile risk average
            func.coalesce(subq, 0.0).label("avg_top_decile_risk")
        ).select_from(Transaction)
        KPIS = session.exec(stmt).one()
        if not KPIS:
            raise HTTPException(status_code=404, detail="No data found")
        return KPISummary(total_transactions=int(KPIS.total_transactions), total_exposure_amount=float(KPIS.total_exposure_amount)
        ,total_fraud_count=int(KPIS.total_fraud_count),total_fraud_value=float(KPIS.total_fraud_value)
        ,avg_top_decile_risk=float(KPIS.avg_top_decile_risk))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database aggregation failed: {str(e)}")



