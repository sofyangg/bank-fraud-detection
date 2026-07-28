import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { TransactionTable } from "@/components/Common/txsTable"
//import { Provider } from "@/components/ui/provider"

import {
  AlertTriangle,
  Activity,TrendingUp} from "lucide-react"
  /*
import { Suspense } from "react"
*/
import { KpisService ,TxsService} from "@/client"
/*
import AddItem from "@/components/Items/AddItem"
import { columns } from "@/components/Items/columns"
import PendingItems from "@/components/Pending/PendingItems"
*/

function getKPISummary() {
  return {
    queryFn: () => KpisService.readKpis(),
    queryKey: ["kpis"],
  }
}

function getTable() {
  return {
    queryFn: () => TxsService.readTable(),
    queryKey: ["txs"],
  }
}


function Cards() {
  
  const { data } = useSuspenseQuery(getKPISummary());
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Total Analyzed */}
      <div className="col-span-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Total Analyzed
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              {data.total_transactions.toLocaleString()}
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              $
              {data.total_exposure_amount.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="rounded-xl bg-gray-100 p-3">
            <Activity className="h-5 w-5 text-gray-700" />
          </div>
        </div>
      </div>

      {/* Flagged Transactions */}
      <div className="col-span-4 rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-red-600">
              Flagged Transactions
            </p>

            <h2 className="mt-3 text-3xl font-bold text-red-700">
              {data.total_fraud_count.toLocaleString()}
            </h2>

            <p className="mt-2 text-sm text-red-500">
              $
              {data.total_fraud_value.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="rounded-xl bg-red-100 p-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
        </div>
      </div>

      {/* Avg Top Decile Risk */}
      <div className="col-span-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Avg Top Decile Risk
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              {(data.avg_top_decile_risk * 100).toFixed(1)}%
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Highest risk segment
            </p>
          </div>

          <div className="rounded-xl bg-gray-100 p-3">
            <TrendingUp className="h-5 w-5 text-gray-700" />
          </div>
        </div>
      </div>
    </div>
);}


function Tx_Table(){
  const { data } = useSuspenseQuery(getTable());
    return (
    <TransactionTable  dataBag={data} />
    );
    
}

function KPIs()
{
  return(
    
    <div className="flex flex-col gap-6">
    <Cards/>
    <Tx_Table />
    </div>
  );

}




export const Route = createFileRoute("/_layout/KPICards")({
  component: KPIs,
  head: () => ({
    meta: [
      {
        title: "KPIs - Sphynx",
      },
    ],
  }),
})