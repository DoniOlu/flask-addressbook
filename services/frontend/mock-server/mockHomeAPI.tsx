const apiRoutes = (app) => {
  app.get("/contact/users", (req, res) => {
    const contacts: Array<{
      id: number;
      first_name: string;
      last_name: string | null;
      phone: string;
      email: string | null;
      address: string;
      birthday: string | null;
    }> = [];

    for (let i = 0; i < 5; i++) {
      contacts.push({
        id: 1234135 + 4 * i,
        first_name: `Contact ${i + 1}`,
        last_name: "Last Name",
        phone: "1234567890",
        email: `randomemail${i}@email.com`,
        address: "123 Fake Street, Houston, TX 77044",
        birthday: "01-01-2024",
      });
    }

    contacts.push({
      id: 123412,
      first_name: `Contact ${6}`,
      last_name: null,
      phone: "1234567890",
      email: null,
      address: "123 Fake Street, Houston, TX 77044",
      birthday: null,
    });

    res.json({ data: contacts, status: 200 });
  });

  app.get("/contact/:id", (req, res) => {
    const contact = {
      id: 12424151,
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
    setTimeout(() => {
      res.status(200).send();
    }, 2000);
  });

  app.post("/contact/edit/:id", (req, res) => {
    setTimeout(() => {
      res.status(200).send();
    }, 2000);
  });

  app.delete("/contact/delete/:id", (req, res) => {
    setTimeout(() => {
      res.status(200).send();
    }, 2000);
  });
};

export default apiRoutes;
