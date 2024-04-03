const apiRoutes = (app) => {
  app.get("/contact/users", (req, res) => {
    const contacts: Array<{
      first_name: string;
      last_name: string;
      phone: string;
      email: string;
      address: string;
      birthday: string;
    }> = [];

    for (let i = 0; i < 5; i++) {
      contacts.push({
        first_name: `Contact ${i + 1}`,
        last_name: "Last Name",
        phone: "1234567890",
        email: `randomemail${i}@email.com`,
        address: "123 Fake Street, Houston, TX 77044",
        birthday: "01-01-2024",
      });
    }

    res.json({ data: contacts, status: 200 });
  });

  app.get("/contact/:id", (req, res) => {
    const contact = {
      first_name: `Contact Name`,
      last_name: "Last Name",
      phone: "1234567890",
      email: `randomemail1@email.com`,
      address: "123 Fake Street, Houston, TX 77044",
      birthday: "01-01-2024",
    };

    res.send({ data: contact, status: 200 });
  });

  app.put("/contact/add", (req, res) => {
    res.status(200);
  });

  app.post("/contact/edit/:id", (req, res) => {
    res.status(200);
  });

  app.delete("/contact/delete/:id", (req, res) => {
    res.status(200);
  });
};

export default apiRoutes;
