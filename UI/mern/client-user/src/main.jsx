import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from "./App";


import Help from "./pages/admin/Help.jsx";
import Login from "./pages/admin/LoginUser.jsx";
import EditMenuItems from "./pages/admin/MenuItemsEdit.jsx";
import EditMenus from "./pages/admin/MenusEdit.jsx";
import OrderHistory from "./pages/admin/OrderHistory.jsx";
import TrackRobits from "./pages/admin/RobotTrack.jsx";
import AssignTables from "./pages/admin/TableAssign.jsx";
import EditUsers from "./pages/admin/UserEdit.jsx";
import WelcomePageUser from "./pages/admin/WelcomeUser.jsx";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/user",
    element: <App />,
    children: [
      { path: "help", element: <Help /> },
      { path: "login", element: <Login /> },
      { path: "itemEdits", element: <EditMenuItems /> },
      { path: "menusEdit", element: <EditMenus /> },
      { path: "history", element: <OrderHistory /> },
      { path: "tracker", element: <TrackRobits /> },
      { path: "assign", element: <AssignTables /> },
      { path: "users", element: <EditUsers /> },
      { path: true, element: <WelcomePageUser /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
