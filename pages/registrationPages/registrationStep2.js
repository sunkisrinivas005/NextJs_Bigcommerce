import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Grid, MenuItem, Button } from "@material-ui/core";
import {
  TextValidator,
  SelectValidator,
  ValidatorForm,
} from "react-material-ui-form-validator";
import { Heading, TextContainer } from "@shopify/polaris";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";

const styles = (theme) => ({
  buttonWrapper: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
  },
  button: {
    // margin: theme.spacing.unit,
    backgroundColor: "#002366",
  },
  inputRoot: {
    fontSize: 12,
  },
  labelRoot: {
    fontSize: 12,
  },
});

const RegistrationStep2 = (props) => {
  const phoneNumberErrorInvalid =
    props.phone && !isValidPhoneNumber(props.phone);
  const { classes } = props;

  return (
    <ValidatorForm onSubmit={props.handleNextStep2} autoComplete="off">
      <Grid container>
        <Grid item md={12} style={{ paddingTop: "25px", paddingBottom: "0px" }}>
          <TextContainer>
            <div style={{ paddingLeft: "10px" }}>
              <Heading>TELL US ABOUT YOUR COMPANY</Heading>
            </div>
          </TextContainer>
        </Grid>
        <Grid item sm={12} md={5} style={{ marginLeft: "50px" }}>
          <TextValidator
            InputProps={{ classes: { root: classes.inputRoot } }}
            InputLabelProps={{
              classes: {
                root: classes.labelRoot,
                focused: classes.labelFocused,
              },
            }}
            name="companyName"
            fullWidth={true}
            value={props.companyName}
            style={{ height: "75px", width: "90%" }}
            label="Company Name"
            placeholder="Company Name"
            helperText="Required field"
            validators={["required"]}
            errorMessages={["This field is required."]}
            onChange={props.handleChange("companyName")}
          />
          <TextValidator
            name="website"
            InputProps={{ classes: { root: classes.inputRoot } }}
            InputLabelProps={{
              classes: {
                root: classes.labelRoot,
                focused: classes.labelFocused,
              },
            }}
            fullWidth={true}
            value={props.website}
            style={{ height: "75px", width: "90%" }}
            label="Website"
            placeholder="https://www.website.com"
            helperText="Required field"
            validators={[
              "required",
              "matchRegexp:^(https?|ftp):\\/\\/[^\\s\\/$.?#]+\\.[^\\s]*$",
            ]}
            errorMessages={["This field is required.", "Invalid website url."]}
            onChange={props.handleChange("website")}
          />

          {/* <Grid container> */}
          <div className="col-lg-12 row">
            <div className="col-lg-6">
              <PhoneInput
                placeholder="Phone Number"
                value={props.phone}
                onChange={props.handleChangePhone}
                defaultCountry="US"
                className={`phoneNumberSelect ${
                  props.phoneNumberErrorRequired || phoneNumberErrorInvalid
                    ? "phoneNumberSelect-error"
                    : undefined
                }`}
                style={{ marginTop: "20px" }}
              />
              {!props.phoneNumberErrorRequired && !phoneNumberErrorInvalid && (
                <p className="phoneNumberSelect-custom-p">Required field</p>
              )}
              {props.phoneNumberErrorRequired && (
                <p className="phoneNumberSelect-custom-p-invalid">
                  This field is required.
                </p>
              )}
              {phoneNumberErrorInvalid && (
                <p className="phoneNumberSelect-custom-p-invalid">
                  This number is invalid.
                </p>
              )}
            </div>
            <div className="col-lg-6">
              <TextValidator
                InputProps={{ classes: { root: classes.inputRoot } }}
                InputLabelProps={{
                  classes: {
                    root: classes.labelRoot,
                    focused: classes.labelFocused,
                  },
                }}
                name="phoneExt"
                fullWidth={true}
                value={props.phoneExt}
                style={{ height: "75px", width: "60%", marginBottom: "10px" }}
                label="Phone Extension"
                placeholder="000"
                onChange={props.handleChange("phoneExt")}
              />
            </div>
          </div>
          <SelectValidator
            InputProps={{ classes: { root: classes.inputRoot } }}
            InputLabelProps={{
              classes: {
                root: classes.labelRoot,
                focused: classes.labelFocused,
              },
            }}
            name="agencyQuestion"
            fullWidth={true}
            value={props.agencyQuestion}
            style={{ height: "75px", width: "90%" }}
            helperText="Required field"
            label="Are you an advertising agency?"
            validators={["required"]}
            errorMessages={["This field is required."]}
            onChange={props.handleChange("agencyQuestion")}
          >
            <MenuItem value={""}>
              <em style={{ fontSize: "12px" }}>Select Answer</em>
            </MenuItem>
            <MenuItem value={"true"}>
              <em style={{ fontSize: "12px" }}>Yes</em>
            </MenuItem>
            <MenuItem value={"false"}>
              <em style={{ fontSize: "12px" }}>No</em>
            </MenuItem>
          </SelectValidator>
          {props.agencyQuestion === "true" && (
            <TextValidator
              name="agencyUrl"
              fullWidth={true}
              InputProps={{ classes: { root: classes.inputRoot } }}
              InputLabelProps={{
                classes: {
                  root: classes.labelRoot,
                  focused: classes.labelFocused,
                },
              }}
              value={props.agencyUrl}
              style={{ height: "75px", width: "90%" }}
              label="URL of the brand represented"
              placeholder="https://www.website.com"
              helperText="Required field"
              validators={[
                "required",
                "matchRegexp:^(https?|ftp):\\/\\/[^\\s\\/$.?#]+\\.[^\\s]*$",
              ]}
              errorMessages={[
                "This field is required.",
                "Invalid website url.",
              ]}
              onChange={props.handleChange("agencyUrl")}
            />
          )}
          <SelectValidator
            name="referralQuestion"
            fullWidth={true}
            InputProps={{ classes: { root: classes.inputRoot } }}
            InputLabelProps={{
              classes: {
                root: classes.labelRoot,
                focused: classes.labelFocused,
              },
            }}
            value={props.referralQuestion}
            style={{ height: "75px", width: "90%" }}
            label="Where did you hear about us?"
            placeholder="Where did you hear about us?"
            helperText="Required field"
            validators={["required"]}
            errorMessages={["This field is required."]}
            onChange={props.handleChange("referralQuestion")}
          >
            <MenuItem value={""}>
              <em>Select Answer</em>
            </MenuItem>
            {referralList.map((p, i) => (
              <MenuItem key={i} value={p}>
                <span style={{ fontSize: "12px" }}>{p}</span>
              </MenuItem>
            ))}
          </SelectValidator>
          <TextValidator
            name="promoCode"
            InputProps={{ classes: { root: classes.inputRoot } }}
            InputLabelProps={{
              classes: {
                root: classes.labelRoot,
                focused: classes.labelFocused,
              },
            }}
            fullWidth={true}
            value={props.promoCode}
            style={{ height: "75px", width: "90%" }}
            label="Promo Code"
            disabled={true}
            placeholder="Promo Code"
            // onChange={props.handleChange("promoCode")}
          />
        </Grid>
        <Grid item sm={12} md={5}>
          <TextValidator
            InputProps={{ classes: { root: classes.inputRoot } }}
            InputLabelProps={{
              classes: {
                root: classes.labelRoot,
                focused: classes.labelFocused,
              },
            }}
            name="address1"
            fullWidth={true}
            value={props.address1}
            style={{ height: "75px", width: "90%" }}
            label="Address"
            placeholder="Address"
            helperText="Required field"
            validators={["required"]}
            errorMessages={["This field is required."]}
            onChange={props.handleChange("address1")}
          />
          <TextValidator
            InputProps={{ classes: { root: classes.inputRoot } }}
            InputLabelProps={{
              classes: {
                root: classes.labelRoot,
                focused: classes.labelFocused,
              },
            }}
            name="address2"
            fullWidth={true}
            value={props.address2}
            style={{ height: "75px", width: "90%" }}
            label="Suite number"
            placeholder="Suite number"
            onChange={props.handleChange("address2")}
          />
          {(props.country === "" || props.country === "US") && (
            <SelectValidator
              InputProps={{ classes: { root: classes.inputRoot } }}
              InputLabelProps={{
                classes: {
                  root: classes.labelRoot,
                  focused: classes.labelFocused,
                },
              }}
              name="state"
              fullWidth={true}
              value={props.state}
              style={{ height: "75px", width: "90%" }}
              label="State"
              placeholder="State"
              helperText="Required field"
              validators={["required"]}
              errorMessages={["This field is required."]}
              onChange={props.handleChange("state")}
            >
              <MenuItem value={""}>
                <em style={{ fontSize: "12px" }}>Select State</em>
              </MenuItem>
              {props.states.map((p, i) => (
                <MenuItem key={i} value={p.value}>
                  <span style={{ fontSize: "12px" }}>{p.label}</span>
                </MenuItem>
              ))}
            </SelectValidator>
          )}
          <TextValidator
            name="city"
            InputProps={{ classes: { root: classes.inputRoot } }}
            InputLabelProps={{
              classes: {
                root: classes.labelRoot,
                focused: classes.labelFocused,
              },
            }}
            fullWidth={true}
            value={props.city}
            style={{ height: "75px", width: "90%" }}
            label="City"
            placeholder="City"
            helperText="Required field"
            validators={["required"]}
            errorMessages={["This field is required."]}
            onChange={props.handleChange("city")}
          />
          <SelectValidator
            name="country"
            InputProps={{ classes: { root: classes.inputRoot } }}
            InputLabelProps={{
              classes: {
                root: classes.labelRoot,
                focused: classes.labelFocused,
              },
            }}
            fullWidth={true}
            value={props.country}
            style={{ height: "75px", width: "90%" }}
            label="Country"
            placeholder="Country"
            helperText="Required field"
            validators={["required"]}
            errorMessages={["This field is required."]}
            onChange={props.handleChange("country")}
          >
            <MenuItem value={""}>
              <em style={{ fontSize: "12px" }}>Select Country</em>
            </MenuItem>
            {props.countries.map((p, i) => (
              <MenuItem key={i} value={p.value}>
                <span style={{ fontSize: "12px" }}>{p.label}</span>
              </MenuItem>
            ))}
          </SelectValidator>
          <TextValidator
            InputProps={{ classes: { root: classes.inputRoot } }}
            InputLabelProps={{
              classes: {
                root: classes.labelRoot,
                focused: classes.labelFocused,
              },
            }}
            name="zipCode"
            fullWidth={true}
            value={props.zipCode}
            style={{ height: "75px", width: "90%" }}
            label="Zip / Postal"
            placeholder="Zip / Postal"
            helperText="Required field"
            validators={["required"]}
            errorMessages={["This field is required."]}
            onChange={props.handleChange("zipCode")}
          />
        </Grid>
        <div
          className={`${props.classes.buttonWrapper} col-lg-12`}
          style={{ paddingBottom: "10px" }}
        >
          <Button
            variant="contained"
            color="default"
            type="primary"
            onClick={props.handleBack}
          >
            <KeyboardArrowLeft />
            Back
          </Button>
          <Button
            // className={props.classes.button}
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginLeft: "20px" }}
          >
            Continue
            <KeyboardArrowRight />
          </Button>
        </div>
      </Grid>
    </ValidatorForm>
  );
};

RegistrationStep2.propTypes = {
  classes: PropTypes.object.isRequired,
  companyName: PropTypes.string.isRequired,
  website: PropTypes.string.isRequired,
  phone: PropTypes.string,
  phoneExt: PropTypes.string.isRequired,
  agencyQuestion: PropTypes.string.isRequired,
  agencyUrl: PropTypes.string.isRequired,
  referralQuestion: PropTypes.string.isRequired,
  promoCode: PropTypes.string.isRequired,
  address1: PropTypes.string.isRequired,
  address2: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  zipCode: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  countries: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  states: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  phoneNumberErrorRequired: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleChangePhone: PropTypes.func.isRequired,
  handleNextStep2: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
};

const referralList = [
  "mThink Top Network Report",
  "Conference",
  "ABestWeb",
  "Affiliate Directory",
  "Industry Web Site",
  "Press Release",
  "Search Engine Ad",
  "Search Result",
  "Other",
];

export default withStyles(styles)(RegistrationStep2);
