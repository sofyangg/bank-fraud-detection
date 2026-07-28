from typing import Any

from fastapi import APIRouter, HTTPException,status
from sqlmodel import   text
from app import crud
from app.crud import get_transactions_page
from app.api.deps import  SessionDep 
from app.models import TxsBag,Transaction

router = APIRouter(prefix="/TXs", tags=["TXs"])
@router.get("/",response_model=TxsBag)
def read_table (
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
    
@router.patch(
    "/{tx_id}",
    response_model=Transaction,
)
def update_tx(
    *,
    session: SessionDep,
    tx_id: str,
    tx_inp: Transaction,
) -> Any:
    tx_it = session.get(Transaction, tx_id)
    if not tx_it:
        raise HTTPException(
            status_code=404,
            detail="The tx with this id does not exist in the system",
        )
    tx_it = crud.update_tx(session=session, tx=tx_it, tx_in=tx_inp)
    return tx_it
