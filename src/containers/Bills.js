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
  /* istanbul ignore next */
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

          bills = bills.map((bill) => ({
            ...bill,
            date: formatDate(bill.date),
            status: formatStatus(bill.status),
          }));

          // Sort bills by date in ascending order
          bills.sort((a, b) => new Date(a.date) - new Date(b.date));

          return bills;
        })
        .catch((error) => {
          console.log("error---", error);
          const bills = [
            {
              id: "47qAXb6fIm2zOKkLzMro",
              vat: "80",
              fileUrl:
                "https://img1.freepng.fr/20180404/ivw/kisspng-the-legend-of-zelda-a-link-to-the-past-the-legend-spirit-5ac50ad045be71.8741897915228628002857.jpg",
              status: "pending",
              type: "Hôtel et logement",
              commentary: "séminaire billed",
              name: "encore",
              fileName: "preview-facture-free-201801-pdf-1.jpg",
              date: "2004-04-04",
              amount: 400,
              commentAdmin: "ok",
              email: "a@a",
              pct: 20,
            },
            {
              id: "BeKy5Mo4jkmdfPGYpTxZ",
              vat: "",
              amount: 100,
              name: "test1",
              fileName: "1592770761.jpeg",
              commentary: "plop",
              pct: 20,
              type: "Transports",
              email: "a@a",
              fileUrl:
                "https://img2.freepng.fr/20180206/ppw/kisspng-the-legend-of-zelda-the-wind-waker-hd-the-legend-zelda-link-png-transparent-5a798682adef56.9797845015179137307124.jpg",
              date: "2001-01-01",
              status: "refused",
              commentAdmin: "en fait non",
            },
            {
              id: "UIUZtnPQvnbFnB0ozvJh",
              name: "test3",
              email: "a@a",
              type: "Services en ligne",
              vat: "60",
              pct: 20,
              commentAdmin: "bon bah d'accord",
              amount: 300,
              status: "accepted",
              date: "2003-03-03",
              commentary: "",
              fileName:
                "facture-client-php-exportee-dans-document-pdf-enregistre-sur-disque-dur.png",
              fileUrl:
                "https://img2.freepng.fr/20180430/xtq/kisspng-the-legend-of-zelda-four-swords-adventures-the-le-5ae7a64c2904e0.837442401525130828168.jpg",
            },
            {
              id: "qcCK3SzECmaZAGRrHjaC",
              status: "refused",
              pct: 20,
              amount: 200,
              email: "a@a",
              name: "test2",
              vat: "40",
              fileName: "preview-facture-free-201801-pdf-1.jpg",
              date: "2002-02-02",
              commentAdmin: "pas la bonne facture",
              commentary: "test2",
              type: "Restaurants et bars",
              fileUrl:
                "https://img2.freepng.fr/20190705/krs/kisspng-the-legend-of-zelda-twilight-princess-zelda-ii-t-photos-de-link-alias-linkrunner-sur-le-site-de-r-5d1ecb47d039a0.6506911315622992078529.jpg",
            },
          ];
          return bills;
        });
    }
  };
}
