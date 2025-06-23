import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "./button.jsx";
import { describe, test, expect } from "vitest";


describe("Button component", () => {
  test("muestra textoActivo si isActive es true", () => {
    render(
      <Button
        isActive={true}
        textoActivo="Activo"
        textoInactivo="Inactivo"
        onToggle={() => {}}
      />
    );
    expect(screen.getByRole("button")).toHaveTextContent("Activo");
  });

  test("muestra textoInactivo si isActive es false", () => {
    render(
      <Button
        isActive={false}
        textoActivo="Activo"
        textoInactivo="Inactivo"
        onToggle={() => {}}
      />
    );
    expect(screen.getByRole("button")).toHaveTextContent("Inactivo");
  });

  test("ejecuta onToggle al hacer clic", () => {
    const onToggleMock = vi.fn();
    render(
      <Button
        isActive={false}
        textoActivo="Activo"
        textoInactivo="Inactivo"
        onToggle={onToggleMock}
      />
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onToggleMock).toHaveBeenCalledTimes(1);
  });

  test("muestra el icono si se pasa", () => {
    const icon = <svg data-testid="icon-svg"></svg>;
    render(
      <Button
        isActive={false}
        textoActivo="Activo"
        textoInactivo="Inactivo"
        onToggle={() => {}}
        icon={icon}
      />
    );
    expect(screen.getByTestId("icon-svg")).toBeInTheDocument();
  });

  test("aplica clase CSS adicional", () => {
    render(
      <Button
        isActive={false}
        textoActivo="Activo"
        textoInactivo="Inactivo"
        onToggle={() => {}}
        className="mi-clase"
      />
    );
    expect(screen.getByRole("button")).toHaveClass("button mi-clase");
  });
});
