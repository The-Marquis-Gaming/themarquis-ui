import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TransactionPage from "../app/deposit/transaction/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StarknetConfig, starkscan } from "@starknet-react/core";
import { appChains, connectors } from "~~/services/web3/connectors";
import provider from "~~/services/web3/provider";
import { expect, test, describe, vi } from "vitest";

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");
  return {
    ...actual,
    useSearchParams: vi.fn(
      () =>
        new URLSearchParams({
          transaction_hash: "0x123...cdef",
          receiver: "0xabcdef1234567890",
          amount: "100.00",
          token: "Strk",
        }),
    ),
  };
});

const queryClient = new QueryClient();

const renderTransactionPage = () => {
  render(
    <StarknetConfig
      chains={appChains}
      provider={provider}
      connectors={connectors}
      explorer={starkscan}
    >
      <QueryClientProvider client={queryClient}>
        <TransactionPage />
      </QueryClientProvider>
    </StarknetConfig>,
  );
};

describe("TransactionPage", () => {
  test("Displays correct transaction details", () => {
    renderTransactionPage();

    expect(screen.getByText("Transaction Hash")).toBeInTheDocument();
    expect(screen.getByText("0x123...cdef")).toBeInTheDocument();

    expect(screen.getByText("Receiver")).toBeInTheDocument();
    expect(screen.getByText("0xabc...7890")).toBeInTheDocument();

    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("100.0000 STRK")).toBeInTheDocument();
  });

  test("Transaction status is correctly displayed", () => {
    renderTransactionPage();

    expect(screen.getByText("Deposit")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  test("Clicking on the transaction hash copies to clipboard", async () => {
    const writeTextMock = vi.fn().mockResolvedValueOnce(undefined);

    Object.defineProperty(global.navigator, "clipboard", {
      value: {
        writeText: writeTextMock,
        readText: vi.fn().mockResolvedValue(""),
        read: vi.fn(),
        write: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
      writable: true,
    });

    renderTransactionPage();

    const clipIcon = screen.getByAltText("link");

    fireEvent.click(clipIcon);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith("0x123...cdef");
    });
  });
});
