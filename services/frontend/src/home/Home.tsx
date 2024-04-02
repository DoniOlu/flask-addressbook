import React, { Component } from "react";
import "./Home.css";
import {
  Button,
  Divider,
  ThemeProvider,
  createTheme,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";

interface IContact {
  id?: string;
  first_name: string;
  last_name: string | null;
  phone: string;
  email: string | null;
  address: string | null;
  birthday: string | null;
}

const theme = createTheme({
  palette: { primary: { main: "rgba(255,255,255)" } },
});

class Home extends Component {
  state: {
    contacts: Array<IContact>;
    selectedContact: IContact | null;
  } = {
    contacts: [],
    selectedContact: null,
  };

  componentDidMount = async () => {
    const data = await axios.get("/contact/users").then(({ data }) => {
      this.setState({ contacts: data });
      return data;
    });

    this.setState({ contacts: data });
  };

  handleSelectContact(contact: IContact): void {
    this.setState({ selectedContact: contact });
  }

  render(): React.ReactNode {
    const { contacts, selectedContact } = this.state;
    return (
      <div className="address-container">
        <div className="address-side-menu">
          {contacts.map((value) => (
            <ThemeProvider theme={theme}>
              <Button
                variant="text"
                className="address-contact"
                onClick={() => this.handleSelectContact(value)}
              >
                {value.first_name}
              </Button>
            </ThemeProvider>
          ))}
        </div>
        <div className="address-details">
          {selectedContact && (
            <>
              {Object.entries(selectedContact).map((value) => (
                <List sx={{ color: "white" }}>
                  <ListItem>
                    <ListItemText primary={value[1]} />
                  </ListItem>
                  <Divider component="li" />
                </List>
              ))}
            </>
          )}
        </div>
      </div>
    );
  }
}

export default Home;
