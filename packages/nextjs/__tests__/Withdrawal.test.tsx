import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, test, describe, vi } from "vitest";
import "@testing-library/jest-dom";
import Page from "../app/withdrawal/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StarknetConfig, starkscan } from "@starknet-react/core";
import { appChains, connectors } from "~~/services/web3/connectors";
import provider from "~~/services/web3/provider";

const queryClient = new QueryClient();

vi.mock("~~/hooks/scaffold-stark/useScaffoldStrkBalance", () => ({
  default: vi.fn().mockReturnValue({ formatted: "100" }),
}));
vi.mock("~~/hooks/scaffold-stark/useScaffoldEthBalance", () => ({
  default: vi.fn().mockReturnValue({ formatted: "50" }),
}));

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
    })),
  };
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
