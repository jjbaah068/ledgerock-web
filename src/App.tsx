import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import Home from "./pages/home.tsx";
import About from "./pages/about.tsx";
import Contact from "./pages/contact.tsx";
import Property from "./pages/properties.tsx";
import PropertyDetail from "./pages/propertydetail.tsx";
import TableRockLiving from "./pages/tablerockliving.tsx";
import AdminLogin from "./pages/adminlogin.tsx";
import AdminDashboard from "./pages/admindashboard.tsx";
import AdminProperties from "./pages/adminproperties.tsx";
import AdminAddProperty from "./pages/adminaddproperty.tsx";
import AdminInquiries from "./pages/admininquiries.tsx";
import AdminEditProperty from "./pages/admineditproperty.tsx";
import AdminChooseProperty from "./pages/adminchooseproperty.tsx";
import AdminSettings from "./pages/adminsettings.tsx";
import AdminLayout from "./components/adminlayout.tsx";
import ScrollToTop from "./components/scrolltotop.tsx";


function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const ledgerockRouter = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/about", element: <About /> },
            { path: "/contact", element: <Contact /> },
            { path: "/properties", element: <Property /> },
            { path: "/properties/:lotId", element: <PropertyDetail /> },
            { path: "/tablerockliving", element: <TableRockLiving /> },
            { path: "/admin", element: <AdminLogin /> },
            {
                element: <AdminLayout />,
                children: [
                    { path: "/admin/dashboard", element: <AdminDashboard /> },
                    { path: "/admin/properties", element: <AdminProperties /> },
                    { path: "/admin/properties/new", element: <AdminAddProperty /> },
                    { path: "/admin/properties/edit", element: <AdminChooseProperty /> },
                    { path: "/admin/properties/:propertyId/edit", element: <AdminEditProperty /> },
                    { path: "/admin/inquiries", element: <AdminInquiries /> },
                    { path: "/admin/settings", element: <AdminSettings /> },
                ],
            },
        ],
    },
]);


function App() {

  return (
    <>
    <RouterProvider router={ledgerockRouter} />
    </>
  )
}

export default App
