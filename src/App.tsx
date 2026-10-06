import { useEffect } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import Home from "./pages/home.tsx";
import About from "./pages/about.tsx";
import Lenis from "lenis";
import Contact from "./pages/contact.tsx";
import Property from "./pages/properties.tsx";
import PropertyDetail from "./pages/propertydetail.tsx";
import TableRockLiving from "./pages/tablerockliving.tsx";
import ScrollToTop from "./components/scrolltotop.tsx";


function RootLayout() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      stopInertiaOnNavigate: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

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
