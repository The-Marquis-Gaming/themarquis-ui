import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Page from "../app/deposit/page";
import TransactionPage from "../app/deposit/transaction/page";
import { expect, test, describe, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StarknetConfig, starkscan } from "@starknet-react/core";
import { appChains, connectors } from "~~/services/web3/connectors";
import provider from "~~/services/web3/provider";

const queryClient = new QueryClient();

const mockPush = vi.fn();
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

vi.mock("@starknet-react/core", async (importOriginal) => {
  const actual = (await importOriginal()) as {
    useAccount: any;
    InjectedConnector: any;
  };

  return {
    ...actual,
    useAccount: vi.fn(() => ({
      address: "0x1234567890abcdef1234567890abcdef12345678",
    })),
    InjectedConnector: vi.fn(() => ({
      connect: vi.fn(),
      isConnected: vi.fn(() => true),
    })),
  };
});

let mockCondition = false;

beforeEach(() => {
  vi.mock("../hooks/scaffold-stark/useScaffoldStrkBalance", () => ({
    __esModule: true,
    default: vi.fn(() => ({
      value: mockCondition ? 2000n : 0n,
      formatted: mockCondition
        ? "2000.000000000000000000"
        : "0.000000000000000000",
      decimals: 18,
      symbol: "STRK",
      isLoading: false,
    })),
  }));
});

let mockConditionTransaction = true;

vi.mock("~~/hooks/scaffold-stark/useScaffoldWriteContract", () => ({
  useScaffoldWriteContract: () => ({
    writeAsync: mockConditionTransaction
      ? vi.fn().mockResolvedValue("txHash123")
      : vi.fn().mockRejectedValue(new Error("Transaction failed")),
  }),
}));

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

describe("Deposit Page Component UI Elements", () => {
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

  test("Max button sets maximum balance", async () => {
    mockCondition = true;
    renderPage();
    const maxButton = screen.getByText("Max");
    fireEvent.click(maxButton);
    const inputField = screen.getAllByPlaceholderText("0.00")[0];
    expect(inputField).toHaveValue("2000.000000000000000000");
    mockCondition = false;
  });

  test("Token modal opens and allows selection of tokens", async () => {
    renderPage();
    const selectTokenButtonStrk = screen.getAllByText(/STRK/i)[0];
    fireEvent.click(selectTokenButtonStrk);
    await waitFor(() => {
      expect(
        screen.getByText("Please select the token to deposit")
      ).toBeInTheDocument();
    });
    const ethOption = screen.getByRole("img", { name: /Eth/i });
    fireEvent.click(ethOption);
    expect(screen.getByRole("img", { name: /Eth/i })).toBeInTheDocument();
  });
});

describe("Submit Button States", () => {
  test("Submit button is disabled if amount is zero", () => {
    renderPage();
    const inputField = screen.getAllByPlaceholderText("0.00")[0];
    const submitButton = screen.getByText("Deposit");

    fireEvent.change(inputField, { target: { value: "0" } });

    expect(submitButton).toBeDisabled();
  });

  test("Submit button is disabled if Strk balance is zero", () => {
    renderPage();
    const inputField = screen.getAllByPlaceholderText("0.00")[0];
    const submitButton = screen.getByText("Deposit");
    fireEvent.change(inputField, { target: { value: "100" } });

    expect(submitButton).toBeDisabled();
  });

  test("Submit button is disabled if Eth balance is zero", () => {
    renderPage();
    const selectTokenButtonStrk = screen.getAllByText(/STRK/i)[0];
    fireEvent.click(selectTokenButtonStrk);
    const selectTokenButtonEth = screen.getAllByText(/eth/i)[0];
    fireEvent.click(selectTokenButtonEth);
    const inputField = screen.getAllByPlaceholderText("0.00")[0];
    fireEvent.change(inputField, { target: { value: "100" } });

    const submitButton = screen.getByText("Deposit");
    expect(submitButton).toBeDisabled();
  });

  test("Balance condition should not trigger insufficient balance alert", async () => {
    mockCondition = true;

    const mockAmount = "500";
    renderPage();
    const inputField = screen.getAllByPlaceholderText("0.00")[0];
    fireEvent.change(inputField, { target: { value: mockAmount.toString() } });

    await waitFor(() => {
      expect(
        screen.queryByText("Insufficient Balance")
      ).not.toBeInTheDocument();
    });
  });

  test("Display insufficient balance alert if amount exceeds balance", async () => {
    mockCondition = false;

    renderPage();
    const inputField = screen.getAllByPlaceholderText("0.00")[0];
    fireEvent.change(inputField, { target: { value: "3000" } });
    await waitFor(() => {
      expect(screen.getByText("Insufficient Balance")).toBeInTheDocument();
    });
  });
});

describe("Transaction Tests", () => {
  test("Successful transaction redirects to transaction page", async () => {
    mockCondition = true;

    renderPage();
    const inputField = screen.getAllByPlaceholderText("0.00")[0];
    fireEvent.change(inputField, { target: { value: "123.45" } });
    const depositButton = screen.getByText("Deposit");
    fireEvent.click(depositButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("/deposit/transaction")
      );
    });
  });
});
