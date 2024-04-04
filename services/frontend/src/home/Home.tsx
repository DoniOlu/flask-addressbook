import React, { ChangeEvent, Component } from "react";
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
  TextField,
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

const dialogButtonTheme = createTheme({
  palette: {
    primary: { main: "#2e5c99" },
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

  handleSubmit = async () => {
    const { contactForm } = this.state;
    await axios.put("/contact/add", contactForm).then(() => {
      this.toggleAddDialog();
    });
  };

  toggleAddDialog(): void {
    const { showAddDialog: prevShowAddDialog } = this.state;
    this.setState({ showAddDialog: !prevShowAddDialog });
  }

  validateForm(form: IContact): boolean {
    const { first_name, phone } = form;

    return first_name !== "" && phone !== "" && phone.length === 10;
  }

  handleFirstNameChange = (name: string) => {
    const { contactForm: prevForm } = this.state;
    const updatedForm = { ...prevForm, first_name: name };
    this.setState({
      contactForm: updatedForm,
      enableSave: this.validateForm(updatedForm),
    });
  };

  handleLastNameChange = (name: string) => {
    const { contactForm: prevForm } = this.state;
    const updatedForm = { ...prevForm, last_name: name };
    this.setState({ contactForm: updatedForm });
  };

  handlePhoneChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (Number.isNaN(event.target.value) || event.target.value.length > 10) {
      event.preventDefault();
    } else {
      const { contactForm: prevForm } = this.state;
      const digits = event.target.value;
      const updatedForm = { ...prevForm, phone: digits };
      this.setState({
        contactForm: updatedForm,
        enableSave: this.validateForm(updatedForm),
      });
    }
  };

  handleAddressChange = (value: string) => {
    const { contactForm: prevForm } = this.state;
    const updatedForm = { ...prevForm, address: value };
    this.setState({ contactForm: updatedForm });
  };

  handleBirthdayChange = (date: Date) => {};

  render(): React.ReactNode {
    const {
      contacts,
      selectedContact,
      showAddDialog,
      enableSave,
      contactForm: { first_name, last_name, address, phone, email },
    } = this.state;

    return (
      <div className="address-container">
        <Dialog
          open={showAddDialog}
          onClose={() => this.toggleAddDialog()}
          PaperProps={{
            style: {
              backgroundColor: "#23334d",
              color: "white",
              minWidth: "60vh",
              minHeight: "50vh",
            },
          }}
        >
          <DialogTitle>{"Add Contact"}</DialogTitle>
          <DialogContent className="contact-dialog-content">
            <TextField
              id="first_name_input"
              variant="outlined"
              label="First Name"
              value={first_name}
              sx={{ fieldSet: { borderColor: "white" } }}
              InputLabelProps={{
                sx: { color: "#6e6e6e", "&:active color": "white" },
              }}
              InputProps={{
                sx: { color: "white" },
              }}
              onChange={({ target: { value } }) => {
                this.handleFirstNameChange(value);
              }}
            />
            <TextField
              id="last_name_input"
              variant="outlined"
              label="Last Name"
              value={last_name}
              sx={{ fieldSet: { borderColor: "white" } }}
              InputLabelProps={{ sx: { color: "#6e6e6e" } }}
              InputProps={{
                sx: { color: "white" },
              }}
              onChange={({ target: { value } }) => {
                this.handleLastNameChange(value);
              }}
            />
            <TextField
              id="phone_input"
              variant="outlined"
              label="(xxx)-xxx-xxxx"
              value={phone}
              sx={{ fieldSet: { borderColor: "white" } }}
              InputLabelProps={{ sx: { color: "#6e6e6e" } }}
              InputProps={{
                sx: { color: "white" },
              }}
              onChange={(event) => {
                this.handlePhoneChange(event);
              }}
            />
            <TextField
              id="email_input"
              variant="outlined"
              label="Email"
              value={email}
              sx={{ fieldSet: { borderColor: "white" } }}
              InputLabelProps={{ sx: { color: "#6e6e6e" } }}
              InputProps={{
                sx: { color: "white" },
              }}
            />
            <TextField
              id="address_input"
              variant="outlined"
              label="Address"
              value={address}
              sx={{ fieldSet: { borderColor: "white" } }}
              InputLabelProps={{ sx: { color: "#6e6e6e" } }}
              InputProps={{
                sx: { color: "white" },
              }}
            />
          </DialogContent>

          <DialogActions>
            <ThemeProvider theme={dialogButtonTheme}>
              <Button
                sx={{
                  background: "#4681cf",
                  color: "white",
                  "&.Mui-disabled": { background: "#323d4a", color: "#858585" },
                }}
                color="primary"
                onClick={() => this.handleSubmit()}
                disabled={!enableSave}
              >
                Add
              </Button>
              <Button
                sx={{
                  background: "#4681cf",
                  color: "white",
                }}
                color="primary"
                onClick={() => this.toggleAddDialog()}
                autoFocus
              >
                Cancel
              </Button>
            </ThemeProvider>
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
