import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth";
import Dashboard from "./components/Dashboard";
import Rolls from "./components/Rolls/Rolls";
import Sliters from "./components/Sliter/Sliters";
import Login from "./components/Login";
import NoMatch from "./components/NoMatch";
import SideMenu from "./components/SideMenu";
import AuthRequire from "./components/AuthRequire";
import Pieces from "./components/Pieces/Pieces";
import Tambur from "./components/Tambur/Tambur";
import FactoryStore from "./components/FactoryStore/FactoryStore";
import Users from "./components/Users/Users";
import Remainings from "./components/Remainings.jsx/Remainings";
import Production from "./components/Productions/Production";
import Lists from "./components/Lists/Lists";
import BlackPipeStore from "./components/BlackPipeStore/BlackPipeStore";
import QandelBlbasStore from "./components/QandelBlabasStore/QandelBlbasStore";
import Tarqeq from "./components/Tarqeq/Tarqeq";
import Reports from "./components/Reports/Reports";
import SelledQandelblas from "./components/QandelBlabasStore/SelledQandelblas";
import SelledBlackpipe from "./components/BlackPipeStore/SelledBlackpipe";
import SelledFactory from "./components/FactoryStore/SelledFactory";
import SelledRemainings from "./components/Remainings.jsx/SelledRemainings";
import RoleRequire from "./components/RoleRequire";
import AllProductsReport from "./components/AllProductsReport";
import Spare from "./components/Spare/Spare";

import "antd/dist/reset.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Activity from "./components/Activities/Activity";
import AllSelleds from "./components/AllSelleds";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route
          path="/"
          element={
            <AuthRequire>
              <SideMenu />
            </AuthRequire>
          }
        >
          {/* Dashboard */}
          <Route
            element={
              <RoleRequire
                allowedRoles={[
                  "Admin",
                  "Accountant",
                  "Watcher",
                  "QandelBlbas",
                  "Store",
                ]}
              />
            }
          >
            <Route index element={<Dashboard />} />
          </Route>
          {/* Reports */}
          <Route
            element={
              <RoleRequire allowedRoles={["Admin", "Accountant", "Watcher"]} />
            }
          >
            <Route path="reports" element={<Reports />} />
            <Route path="activity" element={<Activity />} />
          </Route>
          {/* Rolls */}
          <Route
            element={
              <RoleRequire
                allowedRoles={["Admin", "Accountant", "Enter", "Watcher"]}
              />
            }
          >
            <Route path="rolls" element={<Rolls />} />
          </Route>

          {/* Slitter */}
          <Route
            element={
              <RoleRequire
                allowedRoles={["Admin", "Accountant", "Sliter", "Watcher"]}
              />
            }
          >
            <Route path="sliter" element={<Sliters />} />
            <Route path="pieces" element={<Pieces />} />
            <Route path="remainings" element={<Remainings />} />
          </Route>
          <Route
            element={
              <RoleRequire allowedRoles={["Admin", "Accountant", "Watcher"]} />
            }
          >
            <Route path="tarqeq" element={<Tarqeq />} />
          </Route>
          {/* Tambure */}
          <Route
            element={
              <RoleRequire
                allowedRoles={["Admin", "Accountant", "Watcher", "Tambur"]}
              />
            }
          >
            <Route path="tambur" element={<Tambur />} />
          </Route>
          <Route
            element={
              <RoleRequire allowedRoles={["Admin", "Accountant", "Watcher"]} />
            }
          >
            <Route path="productionlist" element={<Lists />} />
          </Route>
          {/* Store */}
          <Route
            element={
              <RoleRequire
                allowedRoles={["Admin", "Accountant", "Store", "Watcher"]}
              />
            }
          >
            <Route path="productions" element={<Production />} />
            <Route path="factorystore" element={<FactoryStore />} />
            <Route path="blackpipestore" element={<BlackPipeStore />} />
            <Route path="spare" element={<Spare />} />
          </Route>
          <Route
            element={
              <RoleRequire
                allowedRoles={["Admin", "Accountant", "Watcher", "QandelBlbas"]}
              />
            }
          >
            <Route path="qandelblbasstore" element={<QandelBlbasStore />} />
            <Route path="allproduct" element={<AllProductsReport />} />
          </Route>
          <Route
            element={
              <RoleRequire
                allowedRoles={[
                  "Admin",
                  "Accountant",
                  "Watcher",
                  "Store",
                  "QandelBlbas",
                ]}
              />
            }
          >
            <Route path="allsold" element={<AllSelleds />} />
            <Route path="selledQandel" element={<SelledQandelblas />} />
            <Route path="selledBlack" element={<SelledBlackpipe />} />
            <Route path="selledFactory" element={<SelledFactory />} />
            <Route path="selledWastings" element={<SelledRemainings />} />
          </Route>

          {/* Users Only Admin Can See, Edit, and Update */}
          <Route element={<RoleRequire allowedRoles={["Admin"]} />}>
            <Route path="users" element={<Users />} />
          </Route>
        </Route>
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
