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

const styles = (theme) => ({
  buttonWrapper: {
    marginTop: "50px",
    display: "flex",
    justifyContent: "center",
  },
  button: {
    contrastText: "white",
    backgroundColor: "#002366",
  },
  inputRoot: {
    fontSize: 14,
  },
  labelRoot: {
    fontSize: 14,
  },
});

const helperTextProps = {
  style: { fontSize: "14px" },
};

class RegistrationStep1 extends React.Component {
  componentDidMount() {
    ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
      if (value !== this.props.password) {
        return false;
      }
      return true;
    });
    ValidatorForm.addValidationRule("isPasswordStrong", (str) => {
      if (str.length < 8) {
        return false;
      } else if (str.search(/\d/) === -1) {
        return false;
      } else if (str.search(/[!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\_\\+]/) === -1) {
        return false;
      } else if (
        str.search(/[^a-zA-Z0-9\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\_\\+]/) !== -1
      ) {
        return false;
      } else if (str.search(/[A-Z]/) < 0) {
        return false;
      }
      return true;
    });
  }

  componentWillUnmount() {
    ValidatorForm.removeValidationRule("isPasswordMatch");
    ValidatorForm.removeValidationRule("isPasswordStrong");
  }

  render() {
    const props = this.props;
    const { classes } = this.props;

    return (
      <ValidatorForm onSubmit={props.handleNext} autoComplete="off">
        <Grid container>
          <Grid
            item
            md={12}
            style={{
              paddingTop: "30px",
              paddingBottom: "0px",
              backgroundColor: "white",
            }}
          >
            <TextContainer>
              <div style={{ paddingLeft: "10px" }}>
                <Heading>TELL US ABOUT YOURSELF</Heading>
                <p style={{ fontSize: "14px" }}>
                  {" "}
                  Thanks for your interest in FlexOffers.com. To create your
                  advertiser account, please complete the following form. All
                  submissions are thoroughly reviewed by FlexOffers.com and you
                  will be notified via email of the status.
                </p>
              </div>
            </TextContainer>
          </Grid>
          <Grid
            item
            sm={12}
            md={5}
            style={{
              padding: "15px 10px",
              margin: "0px 20px",
              backgroundColor: "white",
            }}
          >
            <TextValidator
              InputProps={{ classes: { root: classes.inputRoot } }}
              InputLabelProps={{
                classes: {
                  root: classes.labelRoot,
                  focused: classes.labelFocused,
                },
              }}
              name="firstName"
              fullWidth={true}
              value={props.firstName}
              style={{ height: "75px", width: "90%" }}
              label="First name"
              placeholder="First name"
              helperText="Required field"
              validators={["required"]}
              errorMessages={["This field is required."]}
              onChange={props.handleChange("firstName")}
              FormHelperTextProps={helperTextProps}
            />
            <TextValidator
              InputProps={{ classes: { root: classes.inputRoot } }}
              InputLabelProps={{
                classes: {
                  root: classes.labelRoot,
                  focused: classes.labelFocused,
                },
              }}
              name="lastName"
              fullWidth={true}
              value={props.lastName}
              style={{ height: "75px", width: "90%" }}
              label="Last name"
              placeholder="Last name"
              helperText="Required field"
              validators={["required"]}
              errorMessages={["This field is required."]}
              onChange={props.handleChange("lastName")}
            />
            <TextValidator
              name="emailAddress"
              InputProps={{ classes: { root: classes.inputRoot } }}
              InputLabelProps={{
                classes: {
                  root: classes.labelRoot,
                  focused: classes.labelFocused,
                },
              }}
              fullWidth={true}
              value={props.emailAddress}
              style={{ height: "75px", width: "90%" }}
              label="Email address"
              placeholder="Email address."
              helperText="Required field"
              validators={["required", "isEmail"]}
              errorMessages={["This field is required.", "Email is not valid."]}
              onChange={props.handleChange("emailAddress")}
            />
          </Grid>
          <Grid
            item
            sm={12}
            md={6}
            style={{ backgroundColor: "white", marginTop: "12px" }}
          >
            <TextValidator
              InputProps={{ classes: { root: classes.inputRoot } }}
              InputLabelProps={{
                classes: {
                  root: classes.labelRoot,
                  focused: classes.labelFocused,
                },
              }}
              name="password"
              fullWidth={true}
              value={props.password}
              style={{ height: "75px", width: "90%" }}
              label="Password"
              placeholder="Password"
              helperText="Required field"
              validators={["required", "isPasswordStrong"]}
              errorMessages={[
                "This field is required.",
                "Password must contain at least 8 characters, including at least one number, one symbol and one upper case letter.",
              ]}
              onChange={props.handleChange("password")}
              type="password"
            />
            <TextValidator
              InputProps={{ classes: { root: classes.inputRoot } }}
              InputLabelProps={{
                classes: {
                  root: classes.labelRoot,
                  focused: classes.labelFocused,
                },
              }}
              name="confirmPassword"
              fullWidth={true}
              value={props.confirmPassword}
              style={{ height: "75px", width: "90%" }}
              label="Confirm Password"
              placeholder="Confirm Password."
              helperText="Required field"
              validators={["required", "isPasswordMatch"]}
              errorMessages={[
                "This field is required.",
                "Password does not match",
              ]}
              onChange={props.handleChange("confirmPassword")}
              type="password"
            />
            <SelectValidator
              InputProps={{ classes: { root: classes.inputRoot } }}
              InputLabelProps={{
                classes: {
                  root: classes.labelRoot,
                  focused: classes.labelFocused,
                },
              }}
              name="securityQuestion"
              fullWidth={true}
              value={props.securityQuestion}
              style={{ height: "75px", width: "90%" }}
              label="Security Question"
              placeholder="Security Question"
              helperText="Required field"
              validators={["required"]}
              errorMessages={["This field is required."]}
              onChange={props.handleChange("securityQuestion")}
            >
              <MenuItem value={""}>
                <em>Select Question</em>
              </MenuItem>
              {securityQuestionList.map((p, i) => (
                <MenuItem key={i} value={p} style={{ fontSize: "14px" }}>
                  {p}
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
              name="securityAnswer"
              fullWidth={true}
              value={props.securityAnswer}
              style={{ height: "75px", width: "90%" }}
              label="Security answer"
              placeholder="Security answer"
              helperText="Required field"
              validators={["required"]}
              errorMessages={["This field is required."]}
              onChange={props.handleChange("securityAnswer")}
            />
          </Grid>
          <div className={`${classes.buttonWrapper} col-lg-12`}>
            <Button
              className={classes.button}
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginRight: "100px" }}
            >
              Continue
              <KeyboardArrowRight />
            </Button>
          </div>
        </Grid>
      </ValidatorForm>
    );
  }
}

const securityQuestionList = [
  "What Is your favorite book?",
  "What is the name of the road you grew up on?",
  "What is your mother’s maiden name?",
  "What was the name of your first/current/favorite pet?",
  "What was the first company that you worked for?",
  "Where did you meet your spouse?",
  "Where did you go to high school/college?",
  "What is your favorite food?",
  "What city were you born in?",
  "Where is your favorite place to vacation?",
];

RegistrationStep1.propTypes = {
  classes: PropTypes.object.isRequired,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  emailAddress: PropTypes.string,
  password: PropTypes.string,
  confirmPassword: PropTypes.string,
  securityQuestion: PropTypes.string,
  securityAnswer: PropTypes.string,
  handleChange: PropTypes.func,
  handleNext: PropTypes.func,
};

export default withStyles(styles)(RegistrationStep1);
