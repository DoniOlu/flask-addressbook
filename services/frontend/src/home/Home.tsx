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
  Box,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import { Dayjs } from "dayjs";
import { format } from "date-fns";

interface IContact {
  id?: string;
  first_name: string;
  last_name: string | null;
  phone: string;
  email: string | null;
  address: string | null;
  birthday: Dayjs | null;
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
    isEditing: boolean;
    isDeleting: boolean;
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
      birthday: null,
    },
    enableSave: false,
    isEditing: false,
    isDeleting: false,
  };

  fetchContactData = async () => {
    const response = await axios.get("/contact/users").then(({ data }) => {
      return data;
    });

    this.setState({ contacts: response.data, selectedContact: null });
  };

  componentDidMount = async () => {
    this.fetchContactData();
  };

  handleSelectContact(contact: IContact): void {
    this.setState({ selectedContact: contact });
  }

  handleSubmit = async () => {
    const { contactForm, isEditing } = this.state;
    let payload: { [key: string]: any } = {};

    if (isEditing) {
      payload = Object.fromEntries(
        Object.entries(contactForm).filter(([_, value]) => value !== null)
      );
    } else {
      payload = Object.fromEntries(
        Object.entries(contactForm).map(([key, value]) => {
          if (value === "") {
            return [key, null];
          }

          return [key, value];
        })
      );
    }

    if (isEditing) {
      await axios.post(`/contact/edit/${payload.id}`, payload).then(() => {
        this.toggleAddDialog();
        this.fetchContactData();
      });
    } else {
      await axios.put("/contact/add", payload).then(() => {
        this.toggleAddDialog();
        this.fetchContactData();
      });
    }
  };

  toggleAddDialog(): void {
    const { showAddDialog: prevShowAddDialog } = this.state;
    this.setState({ showAddDialog: !prevShowAddDialog, isEditing: false });
  }

  toggleEditDialog(selectedContact: IContact | null): void {
    const { showAddDialog: prevShowAddDialog } = this.state;
    this.setState({
      showAddDialog: !prevShowAddDialog,
      contactForm: { ...selectedContact },
      isEditing: !prevShowAddDialog,
    });
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

  handleBirthdayChange = (value: Dayjs | null) => {
    const { contactForm: prevForm } = this.state;
    if (value) {
      const updatedForm = { ...prevForm, birthday: value.format("MM-DD-YYYY") };
      this.setState({ contactForm: updatedForm });
    }
  };

  handleEmailChange = (value: string) => {
    const { contactForm: prevForm } = this.state;
    const updatedForm = { ...prevForm, email: value };
    this.setState({ contactForm: updatedForm });
  };

  handleDeleteContact = async () => {
    const { selectedContact } = this.state;

    await axios.delete(`/contact/delete/${selectedContact?.id}`).then(() => {
      this.toggleDeleteDialog();
      this.fetchContactData();
    });
  };

  toggleDeleteDialog = () => {
    const { isDeleting: prevIsDeleting } = this.state;

    this.setState({ isDeleting: !prevIsDeleting });
  };

  render(): React.ReactNode {
    const {
      contacts,
      selectedContact,
      showAddDialog,
      enableSave,
      contactForm: { first_name, last_name, address, phone, email, birthday },
      isEditing,
      isDeleting,
    } = this.state;

    return (
      <div className="address-container">
        <Dialog
          open={isDeleting}
          onClose={() => this.toggleDeleteDialog()}
          PaperProps={{
            style: {
              backgroundColor: "#23334d",
              color: "white",
              minWidth: "20vh",
              minHeight: "15vh",
            },
          }}
        >
          <DialogTitle>Delete Contact</DialogTitle>
          <DialogContent>
            Are you sure that you want to remove this contact?
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
                onClick={() => this.handleDeleteContact()}
              >
                Ok
              </Button>
              <Button
                sx={{
                  background: "#4681cf",
                  color: "white",
                }}
                color="primary"
                onClick={() => this.toggleDeleteDialog()}
                autoFocus
              >
                Cancel
              </Button>
            </ThemeProvider>
          </DialogActions>
        </Dialog>
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
              onChange={({ target: { value } }) => {
                this.handleEmailChange(value);
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
              onChange={({ target: { value } }) => {
                this.handleAddressChange(value);
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{
                  fieldSet: { borderColor: "white" },
                  svg: { color: "white" },
                  input: { color: "white" },
                }}
                value={birthday}
                onChange={(value) => {
                  this.handleBirthdayChange(value);
                }}
              />
            </LocalizationProvider>
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
                {isEditing ? "Edit" : "Add"}
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
        <div className="address-details-container">
          <div className="address-details-header" id="details-header">
            <Button
              sx={{ background: "#9c9c9c", color: "white" }}
              onClick={() => {
                this.toggleEditDialog(selectedContact);
              }}
              disabled={!selectedContact}
            >
              Edit
            </Button>
            <Button
              sx={{ background: "#9c9c9c", color: "white" }}
              onClick={() => {
                this.toggleDeleteDialog();
              }}
              disabled={!selectedContact}
            >
              Delete
            </Button>
          </div>
          <div className="address-details">
            {selectedContact && (
              <>
                {Object.entries(selectedContact).map((value) => {
                  if (value[0] === "id") return <> </>;

                  return (
                    <List sx={{ color: "white" }}>
                      <ListItem>
                        <ListItemText primary={value[1]} />
                      </ListItem>
                      <Divider component="li" />
                    </List>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
