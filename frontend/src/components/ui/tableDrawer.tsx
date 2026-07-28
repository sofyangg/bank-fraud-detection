import {DrawerContent,
        DrawerRoot,
        DrawerHeader,DrawerBody,
        DrawerTitle,DrawerFooter
    } from "@/components/ui/drawer";

import { Button } from "@/components/ui/button"

import {Transaction} from "@/client"
        //  DrawerDescription,DrawerActionTrigger,DrawerTrigger,DrawerCloseTrigger,DrawerFooter
interface TransactionDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: Transaction | null;
}

export function TransactionDrawer({ isOpen, onOpenChange, data }: TransactionDrawerProps) {
  return (
    <DrawerRoot open={isOpen} onOpenChange={(e:any) => onOpenChange(e.open)} placement="end">
        <DrawerContent portalled={false} >
          <DrawerHeader><DrawerTitle>Transaction Details</DrawerTitle></DrawerHeader>
          <DrawerBody>
            {data ? (
              <div >
                <p><strong>ID:</strong> {data.Transaction_ID}</p>
                <p><strong>Amount:</strong> {data.Transaction_Amount}</p>
                <p><strong>Device Type:</strong> {data.Device_Type}</p>
                <p><strong>Fraud Label:</strong> {data.Fraud_Label}</p>
                <p><strong>Fraud Probability:</strong> {data.Fraud_Probability}</p>
              </div>
            ) : (
              <p>No data selected</p>
            )}
          </DrawerBody>
          <DrawerFooter>
            <div className="flex w-full gap-3">
    <Button
      variant="outline"
      className="flex-1 h-11 border-orange-300 text-orange-700 hover:bg-orange-50"
    >
      Mark Fraudulent
    </Button>
  
    <Button
      className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700"
    >
      Mark Legitimate
    </Button>
  </div>
          </DrawerFooter>
        </DrawerContent>
    </DrawerRoot>
  );
}