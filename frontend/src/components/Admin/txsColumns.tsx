import { ColumnDef } from '@tanstack/react-table';
import type{ Transaction } from "@/client" ;// Adjust the import path to your types file

export const transactionColumns: ColumnDef<Transaction>[] = [
  // --- IDENTIFIERS ---
  {
    id: "rowNumber", 
    header: "",    
    cell: (info) => info.row.index+1, 
  },
  {
    accessorKey: 'Transaction_ID',
    header: 'Transaction ID',
  },
  {
    accessorKey: 'User_ID',
    header: 'User ID',
  },

  // --- FINANCIALS (Formatted as Currency) ---
  {
    accessorKey: 'Transaction_Amount',
    header: 'Amount',
    cell: ({ getValue }) => {
      const amount = getValue<number>();
      return <span>${amount.toFixed(2)}</span>;
    },
  },
  {
    accessorKey: 'Account_Balance',
    header: 'Account Balance',
    cell: ({ getValue }) => {
      const balance = getValue<number>();
      return <span>${balance.toFixed(2)}</span>;
    },
  },
  {
    accessorKey: 'Avg_Transaction_Amount_7d',
    header: '7d Avg Amount',
    cell: ({ getValue }) => {
      const avg = getValue<number>();
      return <span>${avg.toFixed(2)}</span>;
    },
  },

  // --- METRICS & SCORES ---
  {
    accessorKey: 'Transaction_Distance',
    header: 'Distance (km)',
    cell: ({ getValue }) => `${getValue<number>().toFixed(1)} km`,
  },
  {
    accessorKey: 'Risk_Score',
    header: 'Risk Score',
    cell: ({ getValue }) => {
      const score = getValue<number>();
      // Optional visual indicator for high risk scores
      const color = score > 75 ? 'orange' : 'inherit';
      return <span style={{ color, fontWeight: score > 75 ? 'bold' : 'normal' }}>{score}</span>;
    },
  },

  // --- METADATA / CATEGORIES ---
  {
    accessorKey: 'Transaction_Type',
    header: 'Type',
  },
  {
    accessorKey: 'Device_Type',
    header: 'Device',
  },
  {
    accessorKey: 'Location',
    header: 'Location',
  },
  {
    accessorKey: 'Merchant_Category',
    header: 'Merchant Category',
  },
  {
    accessorKey: 'Card_Type',
    header: 'Card Type',
  },
  {
    accessorKey: 'Authentication_Method',
    header: 'Auth Method',
  },

  // --- TEMPORAL DATA ---
  {
    accessorKey: 'Timestamp',
    header: 'Date & Time',
    cell: ({ getValue }) => {
      const dateStr = getValue<string>();
      return <span>{new Date(dateStr).toLocaleString()}</span>;
    },
  },
  {
    accessorKey: 'Is_Weekend',
    header: 'Weekend?',
    cell: ({ getValue }) => (getValue<number>() === 1 ? 'Yes' : 'No'),
  },

  // --- FLAGS / BINARY COUNTS (Formatted for readability) ---
  {
    accessorKey: 'IP_Address_Flag',
    header: 'IP Flag',
    cell: ({ getValue }) => (getValue<number>() === 1 ? '⚠️ Suspicious' : 'Normal'),
  },
  {
    accessorKey: 'Previous_Fraudulent_Activity',
    header: 'Prev Fraud?',
    cell: ({ getValue }) => (getValue<number>() === 1 ? '❌ Yes' : 'No'),
  },

  // --- COUNTERS & AGE ---
  {
    accessorKey: 'Daily_Transaction_Count',
    header: 'Daily Tx Count',
  },
  {
    accessorKey: 'Failed_Transaction_Count_7d',
    header: '7d Failed Txs',
    cell: ({ getValue }) => {
      const count = getValue<number>();
      return <span style={{ color: count > 0 ? 'red' : 'inherit' }}>{count}</span>;
    },
  },
  {
    accessorKey: 'Card_Age',
    header: 'Card Age (Days)',
  },

  // --- FRAUD STATUS (From previous requirement) ---
  {
    accessorKey: 'Fraud_Label',
    header: 'Status',
    cell: ({ row }) => {
      const isFraud = row.original.Fraud_Label === 1;
      return (
        <span style={{ color: isFraud ? 'red' : 'green', fontWeight: 'bold' }}>
          {isFraud ? 'fraude' : 'safe'}
        </span>
      );
    },
  },
  {
    accessorKey: 'Fraud_Probability',
    header: 'Fraud Prob.',
    cell: ({ row }) => {
      const probability = row.getValue<number | null>('Fraud_Probability');
      const isFraud = row.original.Fraud_Label === 1;

      if (probability == null) return <span style={{ color: 'gray' }}>N/A</span>;
      
      const formattedPercentage = `${(probability * 100).toFixed(2)}%`;
      return (
        <span style={{ color: isFraud ? 'red' : 'green', fontWeight: 'bold' }}>
          {formattedPercentage}
        </span>
      );
    },
  },
];