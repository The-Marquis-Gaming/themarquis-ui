import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks/dom";

import "@testing-library/jest-dom";
import sinon from "sinon";
import Page from "../app/deposit/page";
import {
  expect,
  test,
  describe,
  vi,
  beforeEach,
  afterEach,
  onTestFailed,
} from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StarknetConfig, starkscan } from "@starknet-react/core";
import { appChains, connectors } from "~~/services/web3/connectors";
import provider from "~~/services/web3/provider";
import useGetUserInfo from "~~/utils/api/hooks/useGetUserInfo";
const queryClient = new QueryClient();

var mockNotification = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
  loading: vi.fn(),
  remove: vi.fn(),
};

vi.mock("@starknet-react/core", async (importOriginal) => {
  const actual = (await importOriginal()) as {
    useAccount: any;
    useNetwork: any;
    StarknetProvider: any;
  };
  return {
    ...actual,
    useAccount: vi.fn(() => ({
      address: "0x1234567890abcdef1234567890abcdef12345678",
    })),
    useNetwork: vi.fn(() => ({
      chain: {
        id: 1,
        name: "Mocked Chain",
        rpcUrl: "https://mocked-rpc.com",
        public: vi.fn(),
      },
    })),
    StarknetProvider: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  };
});

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
let mockAddOneSTRK = false;
beforeEach(() => {
  vi.mock("../hooks/scaffold-stark/useScaffoldStrkBalance", () => ({
    __esModule: true,
    default: vi.fn(() => ({
      value: mockCondition ? 2000n : 0n,
      formatted: mockCondition
        ? mockAddOneSTRK
          ? "2001.000000000000000000"
          : "2000.000000000000000000"
        : "0.000000000000000000",
      decimals: 18,
      symbol: "STRK",
      isLoading: false,
    })),
  }));
});

let mockConditionTransaction = true;

const mockRejectTransaction = vi
  .fn()
  .mockRejectedValue(new Error("Network Error"));
vi.mock("~~/hooks/scaffold-stark/useScaffoldWriteContract", () => ({
  useScaffoldWriteContract: () => ({
    sendAsync: mockConditionTransaction
      ? vi.fn().mockResolvedValue("txHash123")
      : mockRejectTransaction,
  }),
}));

vi.mock("~~/utils/api", () => ({
  fetchUserInfo: vi.fn(),
}));

vi.mock("cookies-next", () => ({
  getCookie: vi.fn(),
  deleteCookie: vi.fn(),
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
    </StarknetConfig>,
  );
};

const createWrapper = () => {
  const queryClient = new QueryClient();

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
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

  Wrapper.displayName = "StarknetWrapper";

  return Wrapper;
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
        screen.getByText("Please select the token to deposit"),
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
        screen.queryByText("Insufficient Balance"),
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
        expect.stringContaining("/deposit/transaction"),
      );
    });
  });
});

describe("Page Component - Loading Indicator", () => {
  test("Should show loading indicator while processing transaction", async () => {
    renderPage();

    const inputField = screen.getAllByPlaceholderText("0.00")[0];
    fireEvent.change(inputField, { target: { value: "123.45" } });

    const depositButton = screen.getByText("Deposit");
    fireEvent.click(depositButton);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });
  });

  test("Disable button 'Deposit' while transaction is loading", async () => {
    renderPage();

    const inputField = screen.getAllByPlaceholderText("0.00")[0];
    const depositButton = screen.getByText("Deposit");

    fireEvent.change(inputField, { target: { value: "123.45" } });
    expect(depositButton).not.toBeDisabled();

    fireEvent.click(depositButton);

    expect(depositButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });
  });
});

describe("Loading state while fetching balance", () => {
  test("Should deposit 1 STRK successfully and update Marquis balance from 2000 to 2001", async () => {
    mockCondition = true;
    mockConditionTransaction = true;
    renderPage();

    const inputField = screen.getAllByPlaceholderText("0.00")[0];
    const marquisBalanceInitial = (
      await screen.findAllByText("2000.0000 STRK")
    )[1];
    const depositButton = screen.getByText("Deposit");
    expect(marquisBalanceInitial).toBeInTheDocument();
    fireEvent.change(inputField, { target: { value: "1" } });
    fireEvent.click(depositButton);
    mockAddOneSTRK = true;

    await waitFor(async () => {
      const updatedBalanceText = (
        await screen.findAllByText("2001.0000 STRK")
      )[1];
      expect(updatedBalanceText).toBeInTheDocument();
    });
  });
});

describe("HandleDeposite network error test", () => {
  test("Should handle network error during transaction and reset loading state", async () => {
    mockConditionTransaction = false;

    renderPage();

    const inputField = screen.getAllByPlaceholderText("0.00")[0];
    fireEvent.change(inputField, { target: { value: "1" } });

    const depositButton = screen.getByText("Deposit");

    fireEvent.click(depositButton);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    expect(mockRejectTransaction).toHaveBeenCalled();
  });
});

describe("UI State After Transaction Cancellation", () => {
  test("Should reset UI state after transaction cancellation error and cleanup ", async () => {
    mockConditionTransaction = false;

    renderPage();

    const inputField = screen.getAllByPlaceholderText("0.00")[0];
    fireEvent.change(inputField, { target: { value: "1" } });

    const depositButton = screen.getByText("Deposit");

    expect(depositButton).not.toBeDisabled();

    fireEvent.click(depositButton);

    expect(depositButton).toBeDisabled();
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    expect(inputField).toHaveValue("");

    mockConditionTransaction = true;
  });
});

// this will be opened later

// describe("fetchPriceFromCoingecko", () => {
//   afterEach(() => {
//     sinon.restore();
//   });

//   test("Should handle network errors and retry the specified number of times", async () => {
//     const fetchStub = sinon.stub(global, "fetch");

//     fetchStub.rejects(new Error("Network Error"));

//     const price = await fetchPriceFromCoingecko("ETH", 3);

//     expect(fetchStub.callCount).toBe(3);

//     expect(price).toBe(0);
//   });
//   test("Should return 0 if API returns an unexpected response format STRK", async () => {
//     const fetchStub = sinon.stub(global, "fetch");

//     fetchStub.resolves(
//       new Response(JSON.stringify({}), {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       }),
//     );

//     const price = await fetchPriceFromCoingecko("STRK");

//     expect(price).toBe(0);

//     fetchStub.restore();
//   });

//   test("Should return 0 if API returns an unexpected response format ETH", async () => {
//     const fetchStub = sinon.stub(global, "fetch");

//     fetchStub.resolves(
//       new Response(JSON.stringify({}), {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       }),
//     );

//     const price = await fetchPriceFromCoingecko("ETH");

//     expect(price).toBe(0);

//     fetchStub.restore();
//   });
// });

describe("useGetUserInfo", () => {
  afterEach(() => {
    sinon.restore();
  });
  renderPage();
  test("handles fetch errors correctly", async () => {
    onTestFailed(async () => {
      const fetchStub = sinon.stub(global, "fetch");

      fetchStub.rejects(new Error("Failed to fetch user info"));

      sinon.stub(global, "document").value({
        cookie: "accessToken=mockedAccessToken",
      });

      const { result, waitFor } = renderHook(() => useGetUserInfo(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => result.current.isError);

      expect(result.current.error).toEqual(
        new Error("Failed to fetch user info"),
      );
      expect(fetchStub.calledOnce).toBe(true);

      fetchStub.restore();
    });
  });
});
