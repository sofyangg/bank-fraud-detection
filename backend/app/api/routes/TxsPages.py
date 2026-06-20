from typing import Any

from fastapi import APIRouter, HTTPException,status
from sqlmodel import   text

from app.crud import get_transactions_page
from app.api.deps import  SessionDep 
from app.models import TxsBag

router = APIRouter(prefix="/TXs", tags=["TXs"])
@router.get("/",response_model=TxsBag)
def read_dashboard (
    session: SessionDep,
    last_ID: str | None = None
) -> TxsBag:
    try:
        TXS=get_transactions_page(session,last_id=last_ID)
        return TxsBag(txs=TXS)
    except Exception as e:
        # This stops execution and returns a 500 error to the client
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Transaction Page Database error: {str(e)}"
        )