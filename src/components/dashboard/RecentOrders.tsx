
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const orderData = [
  { id: '#ORD-001', customer: 'John Doe', date: '2023-05-08', status: 'completed', amount: '$125.00' },
  { id: '#ORD-002', customer: 'Jane Smith', date: '2023-05-08', status: 'processing', amount: '$245.99' },
  { id: '#ORD-003', customer: 'Robert Johnson', date: '2023-05-07', status: 'completed', amount: '$79.50' },
  { id: '#ORD-004', customer: 'Emily Davis', date: '2023-05-07', status: 'pending', amount: '$432.25' },
  { id: '#ORD-005', customer: 'Michael Brown', date: '2023-05-06', status: 'cancelled', amount: '$99.99' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function RecentOrders() {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-muted-foreground border-b">
              <th className="text-left font-medium px-2 py-3">ID</th>
              <th className="text-left font-medium px-2 py-3">Customer</th>
              <th className="text-left font-medium px-2 py-3">Status</th>
              <th className="text-right font-medium px-2 py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orderData.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
              >
                <td className="px-2 py-3">
                  <div className="text-sm font-medium">{order.id}</div>
                  <div className="text-xs text-muted-foreground">{order.date}</div>
                </td>
                <td className="px-2 py-3">
                  <div className="text-sm font-medium">{order.customer}</div>
                </td>
                <td className="px-2 py-3">
                  <Badge 
                    variant="outline" 
                    className={`capitalize ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </Badge>
                </td>
                <td className="px-2 py-3 text-right font-medium">{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center">
        <Button variant="outline" size="sm">
          View all orders
        </Button>
      </div>
    </div>
  );
}
