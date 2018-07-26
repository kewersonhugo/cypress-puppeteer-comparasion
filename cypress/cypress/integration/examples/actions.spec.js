/// <reference types="Cypress" />

context("Actions", () => {
  Cypress.on("window:before:load", win => {
    delete win.fetch;
  });

  const now = Cypress.moment("2020-10-10");

  beforeEach(() => {
    cy.clock(now.toDate().getTime());
    cy.server().visit("https://cvc.com.br/pacotes-turisticos/2");
  });

  it("should make a search from São Paulo to Fortaleza", () => {
    cy.route(/locations/).as("locationOrigem");
    cy.get("#ORIGEM").type("são p", { delay: 100 });
    cy.wait("@locationOrigem")
      .get("#menu-list-cidades")
      .contains("São Paulo")
      .click();
    cy.get("#ORIGEM").should("have.value", "São Paulo - SP , Brasil");

    cy.route(/locations/).as("locationDestino");
    cy.get("#DESTINO").type("forta", { delay: 100 });
    cy.wait("@locationDestino")
      .get("#menu-list-aeroportos")
      .contains("Fortaleza")
      .click();
    cy.get("#DESTINO").should(
      "have.value",
      "Aeroporto Internacional Pinto Martins, Fortaleza, Brasil (FOR)"
    );

    const valueElDataIda = Cypress.$("#data-IDA")[0].value;
    const valueElDataVolta = Cypress.$("#data-VOLTA")[0].value;
    cy.on("window:before:load", win => {
      const dataIda = Cypress.moment(valueElDataIda, "DD/MM/YY");
      const dataVolta = Cypress.moment(valueElDataVolta, "DD/MM/YY");
      expect(win.location.href).to.equal(
        `https://www.cvc.com.br/monte-sua-viagem/resultados?leaveDateRaw=${encodeURIComponent(
          dataIda.toISOString()
        )}&returnDateRaw=${encodeURIComponent(
          dataVolta.toISOString()
        )}&fromCityCode=9626&fromIATA=SAO&fromIATAId=9275279&fromIATAName=S%C3%A3o%20Paulo%20-%20SP%20%2C%20Brasil&toCityCode=1463&toIATA=FOR&toIATAId=613&toIATAName=Aeroporto%20Internacional%20Pinto%20Martins%2C%20Fortaleza%2C%20Brasil%20(FOR)&packageGroup=PACKAGE&numberOfRooms=1&rooms=1&ages=30%2C30&pageNumber=1&routes=SAO%2CFOR%2C${dataIda.format(
          "YYYY-MM-DD"
        )}%2BFOR%2CSAO%2C${dataVolta.format("YYYY-MM-DD")}&filtered=true`
      );
    });

    cy.get("#button-submit-msv").click();
  });
});
