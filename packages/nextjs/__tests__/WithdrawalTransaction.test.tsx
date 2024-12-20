import { render, screen } from "@testing-library/react";
import { expect, test, describe, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import Page from "../app/withdrawal/transaction/page";
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

let status: string | undefined = "success";

beforeEach(() => {
  vi.mock("@starknet-react/core", async (importOriginal) => {
    const actual = (await importOriginal()) as {
      useTransactionReceipt: {
        data:
          | {
              statusReceipt: string;
              transaction_hash: string;
              message: string;
            }
          | undefined;
      };
      InjectedConnector: any;
    };
    return {
      ...actual,
      __esModule: true,
      useTransactionReceipt: vi.fn(() => ({
        data:
          status != "pending"
            ? {
                statusReceipt: status,
                transaction_hash: "0x123...cdef",
                message: "Transaction successful",
              }
            : undefined,
      })),
      InjectedConnector: vi.fn(),
    };
  });
});

const renderTransactionPage = () => {
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
    </StarknetConfig>,
  );
};

describe("Page Component Tests", () => {
  test("Displays transaction success details", async () => {
    renderTransactionPage();

    const successMessage = await screen.findByText(/Transaction Completed/i);

    expect(successMessage).toBeInTheDocument();
  });

  test("Displays transaction error details", async () => {
    status = "error";
    renderTransactionPage();

    const successMessage = await screen.findByText(/Transaction Error/i);

    expect(successMessage).toBeInTheDocument();
  });

  test("Displays transaction hash", async () => {
    renderTransactionPage();

    const transactionHash = await screen.findByText("0x123...cdef");

    expect(transactionHash).toBeInTheDocument();
  });
  test("Pending transaction, !transactionInfor", () => {
    status = "pending";
    renderTransactionPage();
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });
});
