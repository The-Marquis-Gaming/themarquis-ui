import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, test, describe, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import Page from "../app/withdrawal/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StarknetConfig, starkscan } from "@starknet-react/core";
import { appChains, connectors } from "~~/services/web3/connectors";
import provider from "~~/services/web3/provider";

const queryClient = new QueryClient();

const mockPush = vi.fn();

var mockNotificationSuccess = vi.fn();

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: mockPush,
      replace: vi.fn(),
    })),
  };
});

let isBalance = true;

beforeEach(() => {
  vi.mock("~~/hooks/scaffold-stark/useScaffoldStrkBalance", () => ({
    __esModule: true,
    default: vi.fn(() => ({ formatted: isBalance ? "100" : "0" })),
  }));
});

beforeEach(() => {
  vi.mock("~~/hooks/scaffold-stark/useScaffoldEthBalance", () => ({
    __esModule: true,
    default: vi.fn(() => ({ formatted: isBalance ? "50" : "0" })),
  }));
});

const renderPage = () => {
  render(
    <StarknetConfig
      chains={appChains}
      provider={provider}
      connectors={connectors}
      explorer={starkscan}
    >
      <QueryClientProvider client={queryClient}>
        <Page />
      </QueryClientProvider>
    </StarknetConfig>
  );
};

describe("Balance display", () => {
  test("should display the Marquis and Wallet balance correctly", () => {
    renderPage();

    expect(screen.getByText("Marquis Balance:")).toBeInTheDocument();
    expect(screen.getByText("Wallet Balance:")).toBeInTheDocument();
    expect(screen.getAllByText("100.0000 STRK")[0]).toBeInTheDocument();
    expect(screen.getAllByText("100.0000 STRK")[1]).toBeInTheDocument();
  });
  test("should display the Marquis and Wallet StrkBalance correctly", () => {
    renderPage();

    expect(screen.getAllByText("100.0000 STRK")[0]).toBeInTheDocument();
    expect(screen.getAllByText("100.0000 STRK")[1]).toBeInTheDocument();
  });

  test("should display the Marquis and Wallet EthBalance correctly", async () => {
    renderPage();

    const selectTokenButtonStrk = screen.getAllByText(/STRK/i)[0];
    fireEvent.click(selectTokenButtonStrk);

    const ethOption = screen.getByAltText(/Eth/i);
    fireEvent.click(ethOption);

    expect(screen.getAllByText("50.00000000 ETH")[0]).toBeInTheDocument();
    expect(screen.getAllByText("50.00000000 ETH")[1]).toBeInTheDocument();
  });
});

describe("Input validation", () => {
  const testInputField = (inputField: Node | Window) => {
    fireEvent.change(inputField, { target: { value: "123.45" } });
    expect(inputField).toHaveValue("123.45");

    fireEvent.change(inputField, { target: { value: "" } });
    fireEvent.change(inputField, { target: { value: "abc" } });
    expect(inputField).toHaveValue("");

    fireEvent.change(inputField, { target: { value: "123abc" } });
    expect(inputField).toHaveValue("");
  };

  test("Input field validation allows only numeric values", () => {
    renderPage();
    const inputFieldOne = screen.getAllByPlaceholderText("0.00")[0];
    const inputFieldTwo = screen.getAllByPlaceholderText("0.00")[1];

    testInputField(inputFieldOne);

    testInputField(inputFieldTwo);
  });

  test("Input field should be empty initially", () => {
    renderPage();
    const inputFieldOne = screen.getAllByPlaceholderText("0.00")[0];
    const inputFieldTwo = screen.getAllByPlaceholderText("0.00")[1];

    expect(inputFieldOne).toHaveValue("");
    expect(inputFieldTwo).toHaveValue("");
  });

  test("Input field accepts negative numbers", () => {
    renderPage();
    const inputFieldOne = screen.getAllByPlaceholderText("0.00")[0];
    const inputFieldTwo = screen.getAllByPlaceholderText("0.00")[1];

    fireEvent.change(inputFieldOne, { target: { value: "-123" } });
    expect(inputFieldOne).toHaveValue("");

    fireEvent.change(inputFieldTwo, { target: { value: "-123" } });
    expect(inputFieldTwo).toHaveValue("");
  });

  test("Input field accepts decimal numbers", () => {
    renderPage();
    const inputFieldOne = screen.getAllByPlaceholderText("0.00")[0];
    const inputFieldTwo = screen.getAllByPlaceholderText("0.00")[1];

    fireEvent.change(inputFieldOne, { target: { value: "123.45.67" } });
    expect(inputFieldOne).toHaveValue("");

    fireEvent.change(inputFieldTwo, { target: { value: "123.45.67" } });
    expect(inputFieldTwo).toHaveValue("");
  });

  test("Input field handles large numbers", () => {
    renderPage();
    const inputFieldOne = screen.getAllByPlaceholderText("0.00")[0];
    const inputFieldTwo = screen.getAllByPlaceholderText("0.00")[1];

    fireEvent.change(inputFieldOne, {
      target: { value: "12345678901234567890" },
    });
    expect(inputFieldOne).toHaveValue("12345678901234567890");

    fireEvent.change(inputFieldTwo, {
      target: { value: "12345678901234567890" },
    });
    expect(inputFieldTwo).toHaveValue("12345678901234567890");
  });

  test("Input field updates when deleting characters", () => {
    renderPage();
    const inputFieldOne = screen.getAllByPlaceholderText("0.00")[0];
    const inputFieldTwo = screen.getAllByPlaceholderText("0.00")[1];

    fireEvent.change(inputFieldOne, { target: { value: "123.45" } });
    expect(inputFieldOne).toHaveValue("123.45");

    fireEvent.change(inputFieldOne, { target: { value: "123.4" } });
    expect(inputFieldOne).toHaveValue("123.4");

    fireEvent.change(inputFieldOne, { target: { value: "123" } });
    expect(inputFieldOne).toHaveValue("123");

    fireEvent.change(inputFieldTwo, { target: { value: "123.45" } });
    expect(inputFieldTwo).toHaveValue("123.45");

    fireEvent.change(inputFieldTwo, { target: { value: "123.4" } });
    expect(inputFieldTwo).toHaveValue("123.4");

    fireEvent.change(inputFieldTwo, { target: { value: "123" } });
    expect(inputFieldTwo).toHaveValue("123");
  });
});

describe("Insufficient Balance", () => {
  test("Disables 'Withdraw' button if balance is not insufficient", async () => {
    isBalance = true;
    renderPage();
    const inputField = screen.getAllByPlaceholderText("0.00")[0];

    fireEvent.change(inputField, { target: { value: "3" } });

    await waitFor(() => {
      expect(
        screen.queryByText("Insufficient Balance")
      ).not.toBeInTheDocument();
    });
  });

  test("Disables 'Withdraw' button if balance is insufficient", async () => {
    isBalance = false;
    renderPage();
    const inputField = screen.getAllByPlaceholderText("0.00")[0];

    fireEvent.change(inputField, { target: { value: "3000" } });

    const errorText = await screen.findByText(/Insufficient Balance/i);
    expect(errorText).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Insufficient Balance")).toBeInTheDocument();
    });
  });
});
