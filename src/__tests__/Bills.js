/**
 * @jest-environment jsdom
 */
import { screen, fireEvent } from "@testing-library/dom";
import Bills from "../containers/Bills";
import BillsUI from "../views/BillsUI";
import { bills } from "../fixtures/bills";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import firebase from "../__mocks__/firebase";

describe("Given I am connected as an employee", () => {
  describe("When the Bills page is loading", () => {
    test("Then, the loading message should be displayed", () => {
      const html = BillsUI({ loading: true });
      document.body.innerHTML = html;
      expect(screen.getAllByText("Loading...")).toBeTruthy();
    });
  });
});

describe("When an error occurs on Bills page", () => {
  test("Then, the error message should be displayed", () => {
    const html = BillsUI({ error: "Some error message" });
    document.body.innerHTML = html;
    expect(screen.getByText("Some error message")).toBeTruthy();
  });
});

//Sort the bills array before running the tests
const sortedBills = bills.sort((a, b) => new Date(a.date) - new Date(b.date));

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      const html = BillsUI({ data: [] });
      document.body.innerHTML = html;
    });

    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: sortedBills });
      document.body.innerHTML = html;
      const dates = screen
        .getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i)
        .map((a) => a.innerHTML);
      const chrono = (a, b) => (a > b ? 1 : -1);
      const datesSorted = [...dates].sort(chrono);
      expect(dates).toEqual(datesSorted);
    });
  });
});

describe("When I click on the New Bill button", () => {
  test("Then, it should render the New Bill form", () => {
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };
    const html = BillsUI({ data: [] });
    document.body.innerHTML = html;
    const bills = new Bills({
      document,
      onNavigate,
      firestore: null,
      localStorage: window.localStorage,
    });

    const handleClickNewBill = jest.fn(bills.handleClickNewBill);
    const newBillButton = screen.getByTestId("btn-new-bill");
    newBillButton.addEventListener("click", handleClickNewBill);
    fireEvent.click(newBillButton);
    expect(handleClickNewBill).toHaveBeenCalled();
    expect(screen.getByTestId("form-new-bill")).toBeTruthy();
  });
});

describe("When I click on the eye icon of a bill", () => {
  test("Then, the modal should open", () => {
    const html = BillsUI({ data: bills });
    document.body.innerHTML = html;
    const billsInstance = new Bills({
      document,
      onNavigate: () => {},
      firestore: null,
      localStorage: window.localStorage,
    });

    $.fn.modal = jest.fn();
    const eyeIcon = screen.getAllByTestId("icon-eye")[0];
    fireEvent.click(eyeIcon);

    const modale = document.getElementById("modaleFile");
    expect(modale).toBeTruthy();
    expect($.fn.modal).toHaveBeenCalledWith("show");
  });
});

describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to the Bills page", () => {
    test("Then bills should be fetched from mock API GET", async () => {
      const getSpy = jest.spyOn(firebase, "get");
      const bills = await firebase.get();
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(bills.data.length).toBe(4);
    });
  });
});
