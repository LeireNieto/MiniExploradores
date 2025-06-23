import { describe, test, expect, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FavoritosProvider, useFavoritos } from "../components/favoritos.jsx";

function TestComponent() {
  const { favoritos, esFavorito, toggleFavorito } = useFavoritos();

  return (
    <div>
      <button onClick={() => toggleFavorito("123")}>Toggle</button>
      <div data-testid="estado">{esFavorito("123") ? "Sí" : "No"}</div>
      <div data-testid="lista">{favoritos.join(",")}</div>
    </div>
  );
}

describe("FavoritosContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("inicializa favoritos desde localStorage", () => {
    localStorage.setItem("favoritos", JSON.stringify(["123"]));

    render(
      <FavoritosProvider>
        <TestComponent />
      </FavoritosProvider>
    );

    expect(screen.getByTestId("estado").textContent).toBe("Sí");
  });

  test("toggleFavorito añade y elimina correctamente", async () => {
    render(
      <FavoritosProvider>
        <TestComponent />
      </FavoritosProvider>
    );

    const button = screen.getByText("Toggle");

    // Estado inicial
    expect(screen.getByTestId("estado").textContent).toBe("No");

    // Añadir a favoritos
    await userEvent.click(button);
    expect(screen.getByTestId("estado").textContent).toBe("Sí");

    // Quitar de favoritos
    await userEvent.click(button);
    expect(screen.getByTestId("estado").textContent).toBe("No");
  });

  test("actualiza localStorage al cambiar favoritos", async () => {
    render(
      <FavoritosProvider>
        <TestComponent />
      </FavoritosProvider>
    );
  
    const button = screen.getByText("Toggle");
    await userEvent.click(button);
  
    const almacenados = JSON.parse(localStorage.getItem("favoritos"));
    expect(almacenados).toEqual(["123"]);
  });
});
