from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import   text

from app.api.deps import  SessionDep 
from app.models import Visuals,HeatMap_Data,RadialPolarBar,Sankey_Data,Barchart_risk_bands_Data,Sankey_Link

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
        Temperature=[[0,0,Heatmap[0][0]],[0,1,Heatmap[1][0]],[0,2,Heatmap[2][0]],[1,0,Heatmap[3][0]],[1,1,Heatmap[4][0]],
                [1,2,Heatmap[5][0]],[2,0,Heatmap[6][0]],[2,1,Heatmap[7][0]],[2,2,Heatmap[8][0]],[3,0,Heatmap[9][0]],
                [3,1,Heatmap[10][0]],[3,2,Heatmap[11][0]]]
        
        HeatMap_VS_Data=HeatMap_Data(heat=Temperature)
        
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
        BarchartData=Barchart_risk_bands_Data(bands=[Barchart[0][2],Barchart[1][2],Barchart[2][2],Barchart[3][2],Barchart[4][2]])
        TxTypes=["Point of Sale","Online","ATM withdrawal","Bank Transfer"]
        all_Links=[]
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
            for i in range(4):
                all_Links.append(Sankey_Link(From="Transactions",To=TxTypes[i],Value=TxType[i][0]))
        if not TxType:
            raise HTTPException(status_code=404, detail="No TxType data found")
        device_types=["Laptop","Tablet","Mobile"]
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
        for i in range(0,12,3):
            for j in range(3):
                all_Links.append(Sankey_Link(From=TxTypes[i//3],To=device_types[j],Value=DeviceType[i+j]))
        if not DeviceType:
            raise HTTPException(status_code=404, detail="No DeviceType data found")
        risk=["Low Risk","Medium Risk","High Risk"]
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
        for i in range(1,4):
            for j in range(3):
                all_Links.append(Sankey_Link(From=device_types[j],To=risk[i-1],Value=RiskQuery[i]))
        Low_Risk=(RiskQuery[0][1],RiskQuery[1][1],RiskQuery[2][1])
        Medium_Risk=(RiskQuery[0][2],RiskQuery[1][2],RiskQuery[2][2])
        High_Risk=(RiskQuery[0][3],RiskQuery[1][3],RiskQuery[2][3])
        Sankeyss=Sankey_Data(Links=all_Links)
        return Visuals(RadialPolar=RadialPolarBar_DATA,HeatMap=HeatMap_VS_Data,Barchart=BarchartData,Sankey=Sankeyss)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database fetch failed: {str(e)}")   