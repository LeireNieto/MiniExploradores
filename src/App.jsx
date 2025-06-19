import React from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import Actividades from "./components/actividades";
import "./styles/app.css";
import { AppProvider, useAppContext } from "./components/appcontext";
import { FavoritosProvider } from "./components/favoritos";

function App() {
  return (
    <AppProvider>
      <FavoritosProvider>
        <div className="app-container">
          <Header />
          <main>
            <Actividades />
                    </main>
          <Footer />
        </div>
      </FavoritosProvider>
    </AppProvider>
  );
}


export default App;
