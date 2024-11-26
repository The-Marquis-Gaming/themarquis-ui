import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Page from "../app/deposit/page";

describe("Deposit Page Component UI Elements", () => {
  test("Input field validation allows only numeric values", () => {
    render(<Page />);

    const inputField = screen.getByPlaceholderText("0.00");

    fireEvent.change(inputField, { target: { value: "123.45" } });
    expect(inputField).toHaveValue("123.45");

    fireEvent.change(inputField, { target: { value: "abc" } });
    expect(inputField).toHaveValue("");

    fireEvent.change(inputField, { target: { value: "123abc" } });
    expect(inputField).toHaveValue("123");
  });
});
