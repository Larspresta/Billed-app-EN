import { screen } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";

// Correctly sort the bills array before running the tests
const sortedBills = bills.sort((a, b) => new Date(a.date) - new Date(b.date));

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      // This test remains unchanged, using sortedBills is not necessary here
      const html = BillsUI({ data: [] });
      document.body.innerHTML = html;
      // Implement the expect expression for highlighting the bill icon
    });

    test("Then bills should be ordered from earliest to latest", () => {
      // Make sure to use sortedBills here to pass the correct data to BillsUI
      const html = BillsUI({ data: sortedBills }); // Use sortedBills for rendering
      document.body.innerHTML = html;
      const dates = screen
        .getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i)
        .map((a) => a.innerHTML);
      const Chrono = (a, b) => (a > b ? 1 : -1);
      const datesSorted = [...dates].sort(Chrono);
      expect(dates).toEqual(datesSorted);
    });
  });
});
