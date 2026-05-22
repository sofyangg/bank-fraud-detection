from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import   text

from app.api.deps import  SessionDep 
from app.models import Visuals,HeatMap_Data,RadialPolarBar,Sankey_Data,Barchart_risk_bands_Data

router = APIRouter(prefix="/visuals", tags=["visuals"])
@router.get("/",response_model=Visuals)
def read_kpis(
    session: SessionDep
) -> Any:
    try:
        RadialPolarBar_query = text("""
        SELECT 
        ROUND(AVG("Fraud_Probability")::numeric, 2) AS average_fraud_probability
        FROM 
        "Transaction"
        GROUP BY 
        EXTRACT(HOUR FROM "Timestamp"::timestamp)
        ORDER BY 
        EXTRACT(HOUR FROM "Timestamp"::timestamp) ASC; 
        """)
        RadialPolar= session.exec(RadialPolarBar_query).all()
        chart_data = [float(row[0]) for row in RadialPolar]
        if not RadialPolar:
            raise HTTPException(status_code=404, detail="No RadialPolarBar data found")
        print("RadialPolar")
        for row in RadialPolar:
            print(row)
        RadialPolarBar_DATA=RadialPolarBar(Hours=chart_data)
        Heatmap_Query = text("""
            SELECT 
    ROUND(
    (COUNT(*)::numeric / SUM(COUNT(*)) OVER()) * 100
)::int AS percentage,

    ROUND(
        AVG("Fraud_Probability")::numeric,
        2
    ) AS average_fraud_probability

FROM "Transaction"

GROUP BY 
    "Transaction_Type",
    "Device_Type"

ORDER BY
    CASE UPPER(TRIM("Transaction_Type"))
        WHEN 'POS' THEN 1
        WHEN 'ONLINE' THEN 2
        WHEN 'ATMWITHDRAWAL' THEN 3
        WHEN 'BANKTRANSFER' THEN 4
    END ASC,

    CASE UPPER(TRIM("Device_Type"))
        WHEN 'LAPTOP'  THEN 1
        WHEN 'TABLET' THEN 2
        WHEN 'MOBILE' THEN 3
    END ASC;
            """
            )
        Heatmap= session.exec(Heatmap_Query).all()
        if not Heatmap:
            raise HTTPException(status_code=404, detail="No RadialPolarBar data found")
        print("Heatmap")
        for row in Heatmap:
            print(row)
        POS_pecentage=(Heatmap[0][0],Heatmap[1][0],Heatmap[0][0])
        Online_pecentage=(Heatmap[1][0],Heatmap[1][0],Heatmap[1][0])
        ATM_pecentage=(Heatmap[2][0],Heatmap[2][0],Heatmap[2][0])
        banktransfer_percentage=(Heatmap[3][0],Heatmap[3][0],Heatmap[3][0])

        POS_fraud=(Heatmap[0][1],Heatmap[1][1],Heatmap[0][1])
        Online_fraud=(Heatmap[1][1],Heatmap[1][1],Heatmap[1][1])
        ATM_fraud=(Heatmap[2][1],Heatmap[2][1],Heatmap[2][1])
        banktransfer_fraud=(Heatmap[3][1],Heatmap[3][1],Heatmap[3][1])

        HeatMap_VS_Data=HeatMap_Data(Column_POS=POS_pecentage,POS_fraud=POS_fraud,
                                    Column_Online=Online_pecentage,Online_fraud=Online_fraud,
                                    Column_ATM_Withdrawal=ATM_pecentage,ATM_Withdrawal_fraud=ATM_fraud,
                                    Column_Bank_Transfer=banktransfer_percentage,Bank_Transfer_fraud=banktransfer_fraud)
        
        Barchart_Query = text("""
            SELECT 
    FLOOR("Fraud_Probability" / 0.2) * 0.2 AS bin_start,
    (FLOOR("Fraud_Probability" / 0.2) * 0.2) + 0.2 AS bin_end,
    COUNT(*) AS tx_count
    FROM 
    "Transaction"
    GROUP BY 
    bin_start, bin_end
    ORDER BY 
    bin_start ASC;
            """
            )
        Barchart= session.exec(Barchart_Query).all()
        if not Barchart:
            raise HTTPException(status_code=404, detail="No Barchart data found")
        BarchartData=Barchart_risk_bands_Data(one_0_2=Barchart[0][2],two_0_4=Barchart[1][2],three_0_6=Barchart[2][2],
                                              four_0_8=Barchart[3][2],five_1=Barchart[4][2])
        count_Query = text("""
            SELECT 
        COUNT(*) 
        FROM "Transaction"
            """
            )
        count= session.exec(count_Query).one()
        if not count:
            raise HTTPException(status_code=404, detail="No count data found")
        print(f"count:{count}")
        qty=count[0]
        TxType_Query = text("""
            SELECT
        COUNT(*) AS tx_count_P_type
        FROM "Transaction"
        GROUP BY "Transaction_Type"
        ORDER BY
            CASE UPPER(TRIM("Transaction_Type"))
                WHEN 'POS' THEN 1
                WHEN 'ONLINE' THEN 2
                WHEN 'ATMWITHDRAWAL' THEN 3
                WHEN 'BANKTRANSFER' THEN 4
                END ASC;
            """
            )
        TxType= session.exec(TxType_Query).all()
        print("TxType")
        for row in TxType:
            print(row)
        Tx_typees=(TxType[0][0],TxType[1][0],TxType[2][0],TxType[3][0])
        if not TxType:
            raise HTTPException(status_code=404, detail="No TxType data found")
        DeviceType_Query = text("""
            SELECT 
        UPPER(TRIM("Transaction_Type")) AS clean_tx_type,
        UPPER(TRIM("Device_Type")) AS clean_device,
        COUNT(*) AS tx_count
    FROM 
        "Transaction"
    GROUP BY 
        "Transaction_Type", 
        "Device_Type"
    ORDER BY 
        CASE UPPER(TRIM("Transaction_Type"))
            WHEN 'POS' THEN 1
            WHEN 'ONLINE' THEN 2
            WHEN 'ATMWITHDRAWAL'   THEN 3
            WHEN 'BANKTRANSFER'   THEN 4
        END ASC,
        CASE UPPER(TRIM("Device_Type"))
            WHEN 'LAPTOP'  THEN 1
            WHEN 'TABLET' THEN 2
            WHEN 'MOBILE' THEN 3
        END ASC;
            """)
        DeviceType= session.exec(DeviceType_Query).all()
        print("DeviceType")
        for row in DeviceType:
            print(row)
        Ttype_DeType_Laptop=(DeviceType[0][2],DeviceType[3][2],DeviceType[6][2],DeviceType[9][2])
        Ttype_DeType_Tablet=(DeviceType[1][2],DeviceType[4][2],DeviceType[7][2],DeviceType[10][2])
        Ttype_DeType_Mobile=(DeviceType[2][2],DeviceType[5][2],DeviceType[8][2],DeviceType[11][2])
        if not DeviceType:
            raise HTTPException(status_code=404, detail="No DeviceType data found")
        RiskQuery = text("""
            SELECT 
    UPPER(TRIM("Device_Type")) AS clean_device,
    
    -- Dynamic filters checking numeric probability boundaries
    COUNT(*) FILTER (WHERE "Fraud_Probability" >= 0.0 AND "Fraud_Probability" < 0.3) AS low_risk_count,
    COUNT(*) FILTER (WHERE "Fraud_Probability" >= 0.3 AND "Fraud_Probability" < 0.7) AS medium_risk_count,
    COUNT(*) FILTER (WHERE "Fraud_Probability" >= 0.7 AND "Fraud_Probability" <= 1.0) AS high_risk_count
FROM 
    "Transaction"
GROUP BY 
    clean_device
ORDER BY 
    CASE UPPER(TRIM("Device_Type"))
            WHEN 'LAPTOP'  THEN 1
            WHEN 'TABLET' THEN 2
            WHEN 'MOBILE' THEN 3
        END ASC;
            """)
        RiskQuery= session.exec(RiskQuery).all()
        if not DeviceType:
            raise HTTPException(status_code=404, detail="No DeviceType data found")
        print("Risk Query")
        for row in RiskQuery:
            print(row)
        Low_Risk=(RiskQuery[0][1],RiskQuery[1][1],RiskQuery[2][1])
        Medium_Risk=(RiskQuery[0][2],RiskQuery[1][2],RiskQuery[2][2])
        High_Risk=(RiskQuery[0][3],RiskQuery[1][3],RiskQuery[2][3])
        Sankeyss=Sankey_Data(Transaction_count=qty,
                        Transaction_Type_Values=Tx_typees,
                        Ttype_DeType_Laptop_Values=Ttype_DeType_Laptop,Ttype_DeType_Tablet_Values=Ttype_DeType_Tablet,Ttype_DeType_Mobile_Values=Ttype_DeType_Mobile,
                        DeType_High_Risk_Values=High_Risk,DeType_Medium_Risk_Values=Medium_Risk,DeType_Low_Risk_Values=Low_Risk)
        return Visuals(RadialPolar=RadialPolarBar_DATA,HeatMap=HeatMap_VS_Data,Barchart=BarchartData,Sankey=Sankeyss)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database fetch failed: {str(e)}")   