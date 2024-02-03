import { ROUTES_PATH } from "../constants/routes.js";
import { formatDate, formatStatus } from "../app/format.js";
import Logout from "./Logout.js";

export default class {
  constructor({ document, onNavigate, firestore, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.firestore = firestore;
    const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`);
    if (buttonNewBill) buttonNewBill.addEventListener("click", this.handleClickNewBill);
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`);
    if (iconEye)
      iconEye.forEach((icon) => {
        icon.addEventListener("click", (e) => this.handleClickIconEye(icon));
      });
    new Logout({ document, localStorage, onNavigate });
  }

  handleClickNewBill = (e) => {
    this.onNavigate(ROUTES_PATH["NewBill"]);
  };

  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url");
    const imgWidth = Math.floor($("#modaleFile").width() * 0.5);
    $("#modaleFile")
      .find(".modal-body")
      .html(`<div style='text-align: center;'><img width=${imgWidth} src=${billUrl} /></div>`);
    $("#modaleFile").modal("show");
  };

  // no need to cover this function by tests
  getBills = () => {
    const userEmail = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).email
      : "";
    if (this.firestore) {
      return this.firestore
        .bills()
        .get()
        .then((snapshot) => {
          let bills = snapshot.docs
            .map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }))
            .filter((bill) => bill.email === userEmail);

          // Sort bills by date in ascending order before formatting
          bills.sort((a, b) => new Date(a.date) - new Date(b.date));

          bills = bills.map((bill) => ({
            ...bill,
            date: formatDate(bill.date),
            status: formatStatus(bill.status),
          }));

          return bills;
        })
        .catch((error) => error);
    }
  };
}
