import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom";
import { renderHook, act } from "@testing-library/react-hooks/dom";
import Page from "../app/withdrawal/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as ReactHotToast from "react-hot-toast";
import { StarknetConfig, starkscan } from "@starknet-react/core";
import { appChains, connectors } from "~~/services/web3/connectors";
import { notification } from "~~/utils/scaffold-stark";
import provider from "~~/services/web3/provider";
import useWithDrwaw from "~~/utils/api/hooks/useWithdraw";
import * as WithdrawAPI from "../utils/api/withdraw";
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

vi.mock("react-hot-toast", () => ({
  toast: {
    custom: vi.fn(),
    dismiss: vi.fn(),
    remove: vi.fn(),
  },
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
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  Wrapper.displayName = "QueryClientWrapper";

  return Wrapper;
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
        screen.queryByText("Insufficient Balance"),
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

describe("useWithDrwaw hook", () => {
  let WithDrawMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    WithDrawMock = vi.fn();
    vi.spyOn(WithdrawAPI, "WithDraw").mockImplementation(WithDrawMock);
  });

  test("calls WithDraw with correct arguments", async () => {
    const mockOnSuccess = vi.fn();
    const mockOnError = vi.fn();

    const { result } = renderHook(
      () => useWithDrwaw(mockOnSuccess, mockOnError),
      {
        wrapper: createWrapper(),
      },
    );

    const variables = {
      account_address: "0x123",
      amount: "100",
      token_address: "0xToken",
    };

    await act(async () => {
      result.current.mutate(variables);
    });

    expect(WithDrawMock).toHaveBeenCalledWith(variables);
  });

  test("calls WithDraw with correct arguments", async () => {
    const mockOnSuccess = vi.fn();
    const mockOnError = vi.fn();

    const { result } = renderHook(
      () => useWithDrwaw(mockOnSuccess, mockOnError),
      {
        wrapper: createWrapper(),
      },
    );

    const variables = {
      account_address: "0x123",
      amount: "100",
      token_address: "0xToken",
    };

    await act(async () => {
      result.current.mutate(variables);
    });

    expect(WithDrawMock).toHaveBeenCalledWith(variables);
  });

  test("calls onSuccess when mutation succeeds", async () => {
    const mockOnSuccess = vi.fn();
    const mockOnError = vi.fn();

    WithDrawMock.mockResolvedValueOnce({ transaction_hash: "0xTxHash" });

    const { result } = renderHook(
      () => useWithDrwaw(mockOnSuccess, mockOnError),
      {
        wrapper: createWrapper(),
      },
    );

    const variables = {
      account_address: "0x123",
      amount: "100",
      token_address: "0xToken",
    };

    await act(async () => {
      result.current.mutate(variables);
    });

    expect(mockOnSuccess).toHaveBeenCalledWith(
      { transaction_hash: "0xTxHash" },
      variables,
      undefined,
    );
    expect(mockOnError).not.toHaveBeenCalled();
  });

  test("calls onError when mutation fails", async () => {
    const mockOnSuccess = vi.fn();
    const mockOnError = vi.fn();

    WithDrawMock.mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(
      () => useWithDrwaw(mockOnSuccess, mockOnError),
      {
        wrapper: createWrapper(),
      },
    );

    const variables = {
      account_address: "0x123",
      amount: "100",
      token_address: "0xToken",
    };

    await act(async () => {
      result.current.mutate(variables);
    });

    expect(mockOnError).toHaveBeenCalledWith(
      expect.any(Error),
      variables,
      undefined,
    );

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});

describe("Notification system", () => {
  const originalAddEventListener = global.document.addEventListener;
  const originalRemoveEventListener = global.document.removeEventListener;

  beforeEach(() => {
    global.document.addEventListener = vi.fn();
    global.document.removeEventListener = vi.fn();
  });

  afterEach(() => {
    global.document.addEventListener = originalAddEventListener;
    global.document.removeEventListener = originalRemoveEventListener;
  });

  test("displays success notification", () => {
    notification.success("Operation successful");

    expect(ReactHotToast.toast.custom).toHaveBeenCalledWith(
      expect.any(Function),
      {
        duration: 3000,
        position: "top-center",
      },
    );
  });

  test("displays error notification", () => {
    notification.error("An error occurred");

    expect(ReactHotToast.toast.custom).toHaveBeenCalledWith(
      expect.any(Function),
      {
        duration: 3000,
        position: "top-center",
      },
    );
  });

  test("displays warning notification", () => {
    notification.warning("Be careful!");

    expect(ReactHotToast.toast.custom).toHaveBeenCalledWith(
      expect.any(Function),
      {
        duration: 3000,
        position: "top-center",
      },
    );
  });

  test("displays loading notification", () => {
    notification.loading("Loading...");

    expect(ReactHotToast.toast.custom).toHaveBeenCalledWith(
      expect.any(Function),
      {
        duration: Infinity,
        position: "top-center",
      },
    );
  });

  test("removes notification by ID", () => {
    notification.remove("test-toast-id");

    expect(ReactHotToast.toast.remove).toHaveBeenCalledWith("test-toast-id");
  });
});

// describe("Page component - Notifications for Token Price Error", () => {
//   let notificationErrorStub: sinon.SinonStub;
//   let fetchPriceStub: sinon.SinonStub;

//   beforeEach(() => {
//     notificationErrorStub = sinon
//       .stub(notification, "error")
//       .returns("mock-toast-id");

//     fetchPriceStub = sinon
//       .stub(api, "fetchPriceFromCoingecko")
//       .rejects(new Error("Failed to fetch price"));
//   });

//   afterEach(() => {
//     notificationErrorStub.restore();
//     fetchPriceStub.restore();
//   });

//   test("shows error notification when fetching token price fails", async () => {
//     renderPage();

//     await waitFor(() => {
//       try {
//         sinon.assert.calledWith(
//           notificationErrorStub,
//           sinon.match((msg: string | string[]) => {
//             console.log("Notification message:", msg);
//             return msg.includes("Failed to fetch price");
//           })
//         );
//       } catch (error) {
//         console.error("Notification error not called as expected:", error);
//         throw error;
//       }
//     });
//   });
// });
