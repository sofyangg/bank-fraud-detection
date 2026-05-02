from fastapi import APIRouter, UploadFile, File, Depends, HTTPException,

from typing import List, Any

from app.api.deps import (
    CurrentUser,
    SessionDep,
    get_current_active_superuser,
)


from app import crud
from app.models import (
    Transaction
)

import pandas as pd
import io

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.post(
    "/upload",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=List[Transaction],)
async def Add_Tx(*,session: SessionDep,file: UploadFile = File(...))-> Any:
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="File must be a CSV")
    
    contents = await file.read()
    
    df = pd.read_csv(io.BytesIO(contents))
    
    records = df.to_dict(orient="records")
    
    crud.add_transactions(session=session,transactions_in=records)
    return records[0:6]
    