import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Chatbot from "./chatbot/Chatbot";
import ApplicationList from "./pages/ApplicationList";
import ApplicationDetails from "./pages/ApplicationDetails";
import Analytic from "./pages/analytics/Analytic";

export default function App() {
  return (
    <>
      {/* Chatbot always visible */}
      <Chatbot />

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ApplicationList />} />
          <Route path="/analytics" element={<Analytic />} />
          <Route path="/applications/:id" element={<ApplicationDetails />} />
        </Route>
      </Routes>
    </>
  );
}