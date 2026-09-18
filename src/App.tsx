import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import Home from "./pages/home.tsx";
import About from "./pages/about.tsx";
import Contact from "./pages/contact.tsx";
import Property from "./pages/properties.tsx";
import PropertyDetail from "./pages/propertydetail.tsx";
import TableRockLiving from "./pages/tablerockliving.tsx";
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
