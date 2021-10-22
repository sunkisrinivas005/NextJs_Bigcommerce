import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
// import { connect } from 'react-redux';
// import { displayErrorMessage } from './../../actions/Setting';
import { Grid, Typography, CircularProgress, Button } from "@material-ui/core";
import { Heading, TextContainer, Link } from "@shopify/polaris";
// import { AFFILIATE_PROGRAM_KEY } from './../../constants';

class RegistrationStep3 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      submitting: true,
      errorMessage: "",
      errorPop: false,
    };
  }

  componentDidMount() {
    const that = this;
    Promise.all([
      that.registerAdvertiser(),
      new Promise((resolve) => setTimeout(() => resolve(), 1000)),
    ])
      .then(() => {
        this.setState({ submitting: false });
      })
      .catch((err) => {
        const { message } = err;
        this.setState({
          errorMessage: message,
          errorPop: true,
          submitting: false,
        });
      });
  }

  registerAdvertiser = () => {
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword,
      securityQuestion,
      securityAnswer,
      companyName,
      website,
      phone,
      phoneExt,
      agencyQuestion,
      agencyUrl,
      referralQuestion,
      promoCode,
      address1,
      address2,
      state,
      city,
      country,
      zipCode,
    } = this.props;

    const affiliateProgramReference = "";
    const agencyUrlNormalized = agencyUrl || null;
    return axios
      .post(
        "https://advertiserpro.flexoffers.com/api/shopifystore/registration",
        {
          firstName,
          lastName,
          emailAddress,
          password,
          confirmPassword,
          securityQuestion,
          securityAnswer,
          companyName,
          website,
          phone,
          phoneExt,
          agencyQuestion,
          agencyUrl: agencyUrlNormalized,
          referralQuestion,
          promoCode,
          address1,
          address2,
          state,
          city,
          country,
          zipCode,
          affiliateProgramReference,
        }
      )
      .then((json) => {
        return json.data;
      })
      .catch((err) => {
        throw Error(err.response.data.errorMessage);
      });
  };

  render() {
    const { submitting, errorPop, errorMessage } = this.state;

    return (
      <Grid container spacing={32}>
        {submitting ? (
          <>
            <Grid
              item
              md={12}
              style={{ paddingTop: "50px", minHeight: "350px" }}
            >
              <Typography
                variant="h6"
                align={"center"}
                style={{ paddingBottom: "25px" }}
              >
                Submitting Application To FlexOffers.com
              </Typography>
              <CircularProgress
                size={50}
                color="primary"
                thickness={7}
                style={{ marginLeft: "50%" }}
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item md={12} style={{ paddingTop: "50px" }}>
              <TextContainer>
                {errorPop ? (
                  errorMessage && errorMessage.length ? (
                    <p
                      style={{
                        fontSize: "14px",
                        paddingTop: "20px",
                        color: "red",
                        textAlign: "center",
                      }}
                    >
                      {errorMessage}
                    </p>
                  ) : (
                    <p
                      style={{
                        fontSize: "14px",
                        paddingTop: "20px",
                        color: "red",
                        textAlign: "center",
                      }}
                    >
                      Something went wrong, please contact to support team
                      <a href={"https"}>here</a>
                    </p>
                  )
                ) : (
                  <div style={{ paddingLeft: "10px", textAlign: "center" }}>
                    <Heading>
                      {" "}
                      Thank you for your interest in working with FlexOffers.com
                    </Heading>
                    <p style={{ fontSize: "14px", paddingTop: "20px" }}>
                      {" "}
                      We received your submission and are in the process of
                      reviewing your information. A member of our Business
                      Development team will be in touch with any follow up
                      questions and additional details about FlexOffers.com
                      network.
                    </p>
                  </div>
                )}

                {/* <div
                  className={`col-lg-12 row`}
                  style={{ justifyContent: "center" }}
                >
                  <Button
                    className="col-lg-2"
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ justifyContent: "center" }}
                    // onClick={() => this.props.history.push("/")}
                  >
                    <Link href={{ pathname: "/"}}>
                      <span style={{ color: "white" }}>Home</span>
                    </Link>
                  </Button>
                </div> */}
              </TextContainer>
            </Grid>
          </>
        )}
      </Grid>
    );
  }
}

RegistrationStep3.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  emailAddress: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  confirmPassword: PropTypes.string.isRequired,
  securityQuestion: PropTypes.string.isRequired,
  securityAnswer: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
  website: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  phoneExt: PropTypes.string,
  agencyQuestion: PropTypes.string.isRequired,
  agencyUrl: PropTypes.string,
  referralQuestion: PropTypes.string.isRequired,
  promoCode: PropTypes.string,
  address1: PropTypes.string.isRequired,
  address2: PropTypes.string,
  state: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  zipCode: PropTypes.string.isRequired,
  displayErrorMessage: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
};

export default RegistrationStep3;
