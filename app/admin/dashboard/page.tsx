import Layout from'../layout'

const Dashboard = () => {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Welcome back, Rikkei Academy</h1>
      <div className="grid grid-cols-4 gap-6">
        <div className="p-6 bg-white shadow-md rounded-md">
          <h2 className="text-xl">Total Sales</h2>
          <p className="text-2xl mt-4">$9,328.55</p>
          <p className="text-sm text-green-500">+15.6% this week</p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-md">
          <h2 className="text-xl">Visitors</h2>
          <p className="text-2xl mt-4">12,302</p>
          <p className="text-sm text-green-500">+12.7% this week</p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-md">
          <h2 className="text-xl">Orders</h2>
          <p className="text-2xl mt-4">963</p>
          <p className="text-sm text-red-500">-12.7% this week</p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-md">
          <h2 className="text-xl">Top Categories</h2>
          <div className="mt-4 text-2xl">$6.2k</div>
          <div className="text-sm">Electronics, Laptops, Phones</div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
