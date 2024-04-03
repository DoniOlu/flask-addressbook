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
  createSvgIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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

const dialogTheme = createTheme({
  components: {
    MuiDialog: {
      styleOverrides: {
        root: {
          background: "#23334d",
        },
      },
    },
  },
});

const PlusIcon = createSvgIcon(
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-6 w-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>,
  "Plus"
);

class Home extends Component {
  state: {
    contacts: Array<IContact>;
    selectedContact: IContact | null;
    showAddDialog: boolean;
    contactForm: IContact;
    enableSave: boolean;
  } = {
    contacts: [],
    selectedContact: null,
    showAddDialog: false,
    contactForm: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      address: "",
      birthday: "",
    },
    enableSave: false,
  };

  componentDidMount = async () => {
    const response = await axios.get("/contact/users").then(({ data }) => {
      return data;
    });

    this.setState({ contacts: response.data });
  };

  handleSelectContact(contact: IContact): void {
    this.setState({ selectedContact: contact });
  }

  handleSubmit(): void {
    this.toggleAddDialog();
  }

  toggleAddDialog(): void {
    const { showAddDialog: prevShowAddDialog } = this.state;
    this.setState({ showAddDialog: !prevShowAddDialog });
  }

  validateForm(): void {
    const {
      contactForm: { first_name, phone },
    } = this.state;
    this.setState({ enableSave: first_name && phone });
  }

  render(): React.ReactNode {
    const { contacts, selectedContact, showAddDialog, enableSave } = this.state;
    return (
      <div className="address-container">
        <Dialog open={showAddDialog} onClose={() => this.toggleAddDialog()}>
          <DialogTitle>{"Add Contact"}</DialogTitle>
          <DialogContent className="contact-dialog"></DialogContent>

          <DialogActions>
            <Button onClick={() => this.handleSubmit()} disabled={!enableSave}>
              Add
            </Button>
            <Button onClick={() => this.toggleAddDialog()} autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <div className="address-side-menu">
          <div className="address-side-menu-action-bar">
            <Button
              className="add-contact-button"
              onClick={() => {
                this.toggleAddDialog();
              }}
            >
              <PlusIcon />
            </Button>
          </div>
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
