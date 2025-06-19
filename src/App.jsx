
import React from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import Actividades from "./components/actividades";
import Clima from "./components/clima";
import Mapa from "./components/mapa";
import "./styles/app.css";
import { AppProvider, useAppContext } from "./components/appcontext";

function App() {
  return (
    <AppProvider>
      <div className="app-container">
        <Header />
        <main>
          <Actividades />
          <ClimaWrapper />
          <MapaWrapper />
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
}

// Estos componentes condicionales muestran/ocultan Clima y Mapa según el contexto
function ClimaWrapper() {
  const { showClima } = useAppContext();
  return showClima ? <Clima /> : null;
}

function MapaWrapper() {
  const { showMapa, actividadesFiltradas } = useAppContext(); // o el nombre que uses en el contexto
  return showMapa ? <Mapa actividades={actividadesFiltradas} /> : null;
}


export default App;




