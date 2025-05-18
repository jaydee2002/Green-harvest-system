import {
  BarChart2,
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    label: "Total Sales",
    value: "$42,340",
    icon: DollarSign,
    change: "+12.4%",
    color: "bg-green-100 text-green-600",
  },
  {
    label: "Orders",
    value: "1,280",
    icon: ShoppingCart,
    change: "+8.9%",
    color: "bg-blue-100 text-blue-600",
  },
  {
    label: "Customers",
    value: "4,580",
    icon: Users,
    change: "+4.2%",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    label: "Growth",
    value: "23%",
    icon: TrendingUp,
    change: "+3.7%",
    color: "bg-purple-100 text-purple-600",
  },
];

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <button className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-900 transition">
          Download Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition group"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-500 group-hover:underline">
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <h4 className="text-sm text-gray-500">{stat.label}</h4>
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Sales Overview</h3>
          <BarChart2 className="w-5 h-5 text-gray-500" />
        </div>
        <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
          [Chart will be rendered here]
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
