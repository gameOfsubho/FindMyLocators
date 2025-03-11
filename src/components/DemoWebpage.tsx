import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  Search,
  User,
  Mail,
  Lock,
  ShoppingCart,
  Settings,
  Bell,
  Menu,
  ChevronDown,
} from "lucide-react";

interface DemoWebpageProps {
  onElementSelect?: (element: HTMLElement) => void;
}

const DemoWebpage = ({ onElementSelect = () => {} }: DemoWebpageProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample product data
  const products = [
    {
      id: "prod-1",
      name: "Wireless Headphones",
      price: "$129.99",
      stock: 45,
      category: "Electronics",
    },
    {
      id: "prod-2",
      name: "Smart Watch",
      price: "$199.99",
      stock: 28,
      category: "Electronics",
    },
    {
      id: "prod-3",
      name: "Bluetooth Speaker",
      price: "$79.99",
      stock: 13,
      category: "Electronics",
    },
    {
      id: "prod-4",
      name: "Laptop Backpack",
      price: "$59.99",
      stock: 32,
      category: "Accessories",
    },
    {
      id: "prod-5",
      name: "USB-C Cable (3-pack)",
      price: "$19.99",
      stock: 54,
      category: "Accessories",
    },
  ];

  // Sample user data
  const users = [
    {
      id: "user-1",
      name: "John Smith",
      email: "john.smith@example.com",
      role: "Admin",
    },
    {
      id: "user-2",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      role: "Editor",
    },
    {
      id: "user-3",
      name: "Michael Brown",
      email: "m.brown@example.com",
      role: "Viewer",
    },
  ];

  return (
    <div className="bg-white w-full h-full overflow-auto p-4 rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-slate-50 rounded-t-lg">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            id="menu-button"
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-slate-800" id="site-title">
            Demo Store Admin
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative" id="search-container">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-[200px] md:w-[300px]"
              id="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button variant="ghost" size="icon" id="notifications-button">
            <Bell className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" id="settings-button">
            <Settings className="h-5 w-5" />
          </Button>

          <div
            className="flex items-center space-x-2 border-l pl-4 ml-2"
            id="user-profile"
          >
            <div className="h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center">
              <User className="h-4 w-4 text-slate-600" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100%-80px)]">
        {/* Sidebar */}
        <aside
          className="hidden md:block w-48 p-4 border-r border-gray-200 bg-slate-50"
          id="sidebar"
        >
          <nav className="space-y-1">
            <Button
              variant={activeTab === "dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start"
              id="nav-dashboard"
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </Button>
            <Button
              variant={activeTab === "products" ? "secondary" : "ghost"}
              className="w-full justify-start"
              id="nav-products"
              onClick={() => setActiveTab("products")}
            >
              Products
            </Button>
            <Button
              variant={activeTab === "users" ? "secondary" : "ghost"}
              className="w-full justify-start"
              id="nav-users"
              onClick={() => setActiveTab("users")}
            >
              Users
            </Button>
            <Button
              variant={activeTab === "settings" ? "secondary" : "ghost"}
              className="w-full justify-start"
              id="nav-settings"
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </Button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto" id="main-content">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard" id="tab-dashboard">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="products" id="tab-products">
                Products
              </TabsTrigger>
              <TabsTrigger value="users" id="tab-users">
                Users
              </TabsTrigger>
              <TabsTrigger value="settings" id="tab-settings">
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <h2 className="text-2xl font-bold" id="dashboard-title">
                Dashboard Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card id="card-sales">
                  <CardHeader>
                    <CardTitle>Total Sales</CardTitle>
                    <CardDescription>Last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">$12,456</p>
                    <p className="text-sm text-green-600">
                      +12% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card id="card-orders">
                  <CardHeader>
                    <CardTitle>New Orders</CardTitle>
                    <CardDescription>Last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">142</p>
                    <p className="text-sm text-green-600">
                      +8% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card id="card-customers">
                  <CardHeader>
                    <CardTitle>New Customers</CardTitle>
                    <CardDescription>Last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">64</p>
                    <p className="text-sm text-green-600">
                      +24% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card id="card-recent-orders">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest 5 orders placed</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">#ORD-5523</TableCell>
                        <TableCell>John Smith</TableCell>
                        <TableCell>May 15, 2023</TableCell>
                        <TableCell>$129.99</TableCell>
                        <TableCell>
                          <Badge>Delivered</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">#ORD-5522</TableCell>
                        <TableCell>Sarah Johnson</TableCell>
                        <TableCell>May 14, 2023</TableCell>
                        <TableCell>$259.98</TableCell>
                        <TableCell>
                          <Badge variant="outline">Shipped</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">#ORD-5521</TableCell>
                        <TableCell>Michael Brown</TableCell>
                        <TableCell>May 14, 2023</TableCell>
                        <TableCell>$79.99</TableCell>
                        <TableCell>
                          <Badge variant="outline">Processing</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">#ORD-5520</TableCell>
                        <TableCell>Emily Davis</TableCell>
                        <TableCell>May 13, 2023</TableCell>
                        <TableCell>$199.99</TableCell>
                        <TableCell>
                          <Badge>Delivered</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">#ORD-5519</TableCell>
                        <TableCell>Robert Wilson</TableCell>
                        <TableCell>May 12, 2023</TableCell>
                        <TableCell>$159.98</TableCell>
                        <TableCell>
                          <Badge variant="outline">Shipped</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" id="view-all-orders-btn">
                    View All Orders
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold" id="products-title">
                  Products
                </h2>
                <Button id="add-product-btn">Add Product</Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="product-category">Category:</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="product-category" className="w-[180px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8 w-[250px]"
                    id="product-search"
                  />
                </div>
              </div>

              <Card id="products-table">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox id="select-all-products" />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id} id={product.id}>
                          <TableCell>
                            <Checkbox id={`select-${product.id}`} />
                          </TableCell>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell>{product.price}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Edit</span>
                              <Settings className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold" id="users-title">
                  Users
                </h2>
                <Button id="add-user-btn">Add User</Button>
              </div>

              <Card id="users-table">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox id="select-all-users" />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id} id={user.id}>
                          <TableCell>
                            <Checkbox id={`select-${user.id}`} />
                          </TableCell>
                          <TableCell className="font-medium">
                            {user.name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Edit</span>
                              <Settings className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <h2 className="text-2xl font-bold" id="settings-title">
                Settings
              </h2>

              <Card id="account-settings">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="Admin User" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="admin@example.com"
                    />
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button id="save-settings-btn">Save Changes</Button>
                </CardFooter>
              </Card>

              <Card id="notification-settings">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Manage your notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-gray-500">
                        Receive email notifications for important updates
                      </p>
                    </div>
                    <Checkbox id="email-notifications" defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="order-updates">Order Updates</Label>
                      <p className="text-sm text-gray-500">
                        Receive notifications for order status changes
                      </p>
                    </div>
                    <Checkbox id="order-updates" defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                      <p className="text-sm text-gray-500">
                        Receive promotional emails and offers
                      </p>
                    </div>
                    <Checkbox id="marketing-emails" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" id="save-notification-settings-btn">
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default DemoWebpage;
