import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/home.tsx";




const nexuxRouter = createBrowserRouter([
    {
        children: [
            { path: "/", element: <Home /> },
        ],
    },
]);


function App() {

  return (
    <>
    <RouterProvider router={nexuxRouter} />
    </>
  )
}

export default App
