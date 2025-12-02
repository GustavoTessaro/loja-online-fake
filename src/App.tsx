import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { ClientsPage } from "./pages/ClientsPage";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="app">
          <Header />
          <main style={{ minHeight: "80vh", padding: "1rem" }}>
            <Routes>
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<Navigate to="/products" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
